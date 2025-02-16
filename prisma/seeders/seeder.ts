import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const tipos = ['bug', 'sugestao']
const navegadores = ['Chrome','Opera GX', 'Firefox', 'Safari', 'Edge', 'Brave']
const sistemasOperacionais = ['Windows 11', 'macOS Ventura', 'Ubuntu 22.04', 'Android 14', 'iOS 17']
const prioridades = ['baixa', 'alta']
const statusOptions = ['aberto', 'em análise', 'resolvido', 'arquivado']

function randomElement(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomAnexos() {
  const count = Math.floor(Math.random() * 5) // 0-4 anexos
  return Array.from({ length: count }, (_, i) => ({
    url: `https://picsum.photos/200/300?random=${Math.random() * 1000}`
  }))
}

async function main() {
  const feedbacks = Array.from({ length: 20 }, (_, i) => ({
    tipo: randomElement(tipos),
    emailUsuario: `usuario${i + 1}@exemplo.com`,
    descricao: `Problema com ${['login', 'pagamento', 'interface', 'performance'][i % 4]} no sistema`,
    passosReproducao: Math.random() > 0.3 ? `Passo 1: ${i}\nPasso 2: ...` : null,
    navegador: randomElement(navegadores),
    sistemaOperacional: randomElement(sistemasOperacionais),
    prioridade: randomElement(prioridades),
    status: randomElement(statusOptions),
    anexos: {
      create: randomAnexos()
    }
  }))

  for (const feedback of feedbacks) {
    await prisma.feedback.create({
      data: {
        ...feedback,
        dataCriacao: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      }
    })
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
