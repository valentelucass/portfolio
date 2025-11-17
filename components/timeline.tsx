"use client"

import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

const experiences = [
  {
    title: "Desenvolvedor de Software",
    company: "Rodogarcia",
    period: "2025",
    description:
      "Integração de sistemas internos e externos, criando automações que substituíram processos manuais por fluxos de dados confiáveis. RPA–TMS: automação em Python que eliminou o revezamento de cinco colaboradores em tarefas repetitivas, reduzindo mais de 30 horas semanais e aumentando a produtividade. ETL: automação em Java para extrair dados de três APIs (REST, GraphQL e DataExport) e integrar oito entidades ao Power BI, eliminando processos manuais e garantindo dados em tempo real. O impacto financeiro veio pela redução de custos operacionais e decisões mais precisas (ex.: otimização de rotas e renegociação de contratos). Atuação técnica com produção de relatórios, documentação de fluxos e APIs, além de apresentações de status. Trabalho sob alta demanda, usando comunicação clara e metodologias ágeis. Próxima etapa: desenvolvimento de dashboards internos para substituir o Power BI, reduzindo custos e ampliando a autonomia na análise de dados.",
  },
  {
    title: "Desenvolvedor Full-Stack (Projeto Contratado)",
    company: "Easy Rake e Home Service",
    period: "2025",
    description:
      "Desenvolvi a plataforma Home Service em cinco dias, criando arquitetura e implementação com Node.js, Express, Sequelize e MySQL, além de HTML, CSS e JavaScript no front-end. A solução ajudou o cliente a ampliar presença digital e captar usuários com mais eficiência. Também criei o sistema Easy Rake para gestão de caixa em clubes de poker, usando PHP, MySQL e JavaScript. Implementei login multi-perfil, controle de sessões de caixa, gestão de jogadores e transações em tempo real, melhorando o fluxo financeiro e a organização das operações.",
  },
  {
    title: "Empresário ecommerce",
    company: "Lossantos Brasil",
    period: "2019-2024",
    description:
      "Atuei como empreendedor digital, assumindo a responsabilidade total pela gestão estratégica e operacional de e-commerce. Minhas funções incluíam a liderança de equipes multidisciplinares e o gerenciamento de fornecedores, garantindo a execução eficiente das entregas. Era responsável pela concepção e implementação de campanhas de marketing digital, pela otimização de criativos e pela análise de performance. Além disso, coordenava a logística de ponta a ponta e realizava análises de dados aprofundadas para embasar a tomada de decisões estratégicas, o que resultou na otimização de resultados, melhoria do relacionamento com o cliente e expansão do negócio. Essa vivência consolidou minhas habilidades em organização, liderança, comunicação assertiva, análise de dados e trabalho colaborativo em cenários dinâmicos.",
  },
]

export function Timeline() {
  const isMobile = useMobile()

  return (
    <div
      className={`space-y-12 relative ${
        !isMobile
          ? "before:absolute before:inset-0 before:left-1/2 before:ml-0 before:-translate-x-px before:border-l-2 before:border-zinc-700 before:h-full before:z-0"
          : ""
      }`}
    >
      {experiences.map((experience, index) => (
        <div
          key={index}
          className={`relative z-10 flex items-center ${index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"}`}
        >
          <motion.div
            className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pl-10" : "md:pr-10"}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 p-6 transition-all duration-300 hover:border-cyan-500/50">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur opacity-25 hover:opacity-100 transition duration-1000 hover:duration-200"></div>

              <div className="relative">
                <h3 className="text-xl font-bold">{experience.title}</h3>
                <div className="text-muted-foreground company-period-text mb-4">
                  {experience.company} | {experience.period}
                </div>
                <p className="text-sm md:text-base text-muted-foreground empreendedor-text text-justify">{experience.description}</p>
              </div>
            </div>
          </motion.div>

          {!isMobile && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 z-10 flex items-center justify-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </motion.div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
