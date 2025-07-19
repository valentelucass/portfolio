"use client"

import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

const experiences = [
  {
    title: "Desenvolvedor Full-Stack (Projeto Contratado)",
    company: "Home Service",
    period: "2025",
    description:
      "Desenvolvi a plataforma Home Service do zero em 5 dias, entregando antes do prazo. Fui responsável pela arquitetura e implementação com Node.js, API RESTful, Express, Sequelize e MySQL no back-end, e HTML, CSS e JavaScript no front-end. A plataforma permitiu ao cliente ampliar sua presença digital e otimizar a captação de usuários.",
  },
  {
    title: "Desenvolvedor Full-Stack (Projeto Contratado)",
    company: "Easy Rake",
    period: "2025",
    description:
      "Desenvolvi e implementei o sistema de gestão de caixa Easy Rake para clubes de poker, utilizando PHP, MySQL e JavaScript. Fui responsável pela arquitetura e desenvolvimento de funcionalidades como cadastro e login multi-perfil (Gestor, Caixa, Sanger), controle de sessões de caixa (abertura por inventário, fechamento com reconciliação), gestão de jogadores e transações em tempo real. O sistema otimizou as operações financeiras e o controle de jogadores para clubes de poker.",
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
                <div className="text-muted-foreground mb-4">
                  {experience.company} | {experience.period}
                </div>
                <p className="text-sm md:text-base text-muted-foreground text-justify">{experience.description}</p>
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
