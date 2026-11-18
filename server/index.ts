import fastifyStatic from '@fastify/static'
import fastifyRateLimit from '@fastify/rate-limit'
import Fastify from 'fastify'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { z } from 'zod'
import { sendCustomMail, syncInbox, testCustomConnection } from './mail.js'

const app = Fastify({
  logger: false,
  bodyLimit: 1024 * 1024,
  trustProxy: true,
})

await app.register(fastifyRateLimit, {
  max: 60,
  timeWindow: '1 minute',
})

app.addHook('onRequest', async (request, reply) => {
  if (!request.url.startsWith('/api/')) return

  const origin = request.headers.origin
  if (!origin) return

  const allowedOrigin = process.env.MAILCHAT_PUBLIC_ORIGIN
  if (allowedOrigin && origin !== allowedOrigin) {
    return reply.code(403).send({ ok: false, message: 'The request origin is not allowed.' })
  }
})

const testSchema = z.object({
  imapHost: z.string().trim().min(1).max(253),
  imapPort: z.number().int().min(1).max(65535),
  imapSecure: z.boolean(),
  smtpHost: z.string().trim().min(1).max(253),
  smtpPort: z.number().int().min(1).max(65535),
  smtpSecure: z.boolean(),
  username: z.string().trim().min(1).max(320),
  password: z.string().min(1).max(4096),
})

const syncSchema = z.object({
  accountId: z.string().trim().min(1).max(128),
  imapHost: z.string().trim().min(1).max(253),
  imapPort: z.number().int().min(1).max(65535),
  imapSecure: z.boolean(),
  username: z.string().trim().min(1).max(320),
  password: z.string().min(1).max(4096),
})

const sendSchema = z.object({
  accountId: z.string().trim().min(1).max(128),
  smtpHost: z.string().trim().min(1).max(253),
  smtpPort: z.number().int().min(1).max(65535),
  smtpSecure: z.boolean(),
  username: z.string().trim().min(1).max(320),
  password: z.string().min(1).max(4096),
  to: z.string().trim().min(1).max(320),
  cc: z.string().trim().max(320).optional(),
  bcc: z.string().trim().max(320).optional(),
  subject: z.string().trim().min(1).max(998),
  text: z.string().trim().min(1).max(1024 * 1024),
  html: z.string().max(1024 * 1024).optional(),
})

app.post('/api/mail/custom/test', async (request, reply) => {
  const parsed = testSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.code(400).send({
      ok: false,
      message: 'The custom account settings are invalid.',
    })
  }

  try {
    await testCustomConnection(parsed.data)
    return reply.send({ ok: true, imap: 'connected', smtp: 'verified' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The connection test failed.'
    return reply.code(422).send({ ok: false, message })
  }
})

app.post('/api/mail/custom/sync', async (request, reply) => {
  const parsed = syncSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.code(400).send({
      ok: false,
      message: 'The mailbox sync settings are invalid.',
    })
  }

  try {
    const data = await syncInbox(parsed.data)
    return reply.send(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Mailbox sync failed.'
    return reply.code(422).send({ ok: false, message })
  }
})

app.post('/api/mail/custom/send', async (request, reply) => {
  const parsed = sendSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.code(400).send({
      ok: false,
      message: 'The outgoing mail settings are invalid.',
    })
  }

  try {
    const data = await sendCustomMail(parsed.data)
    return reply.send({ ok: true, ...data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Mail send failed.'
    return reply.code(422).send({ ok: false, message })
  }
})

app.get('/api/health', async () => ({ ok: true }))

const distRoot = resolve(process.cwd(), 'dist')
if (existsSync(distRoot)) {
  await app.register(fastifyStatic, {
    root: distRoot,
    wildcard: false,
  })

  app.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith('/api/')) {
      return reply.code(404).send({ ok: false, message: 'API route not found.' })
    }
    return reply.sendFile('index.html')
  })
}

const port = Number(process.env.PORT || 8787)
const host = process.env.HOST || '0.0.0.0'

try {
  await app.listen({ host, port })
  process.stdout.write(`MailChat relay listening on http://${host}:${port}\n`)
} catch (error) {
  app.log.error(error)
  process.exitCode = 1
}
