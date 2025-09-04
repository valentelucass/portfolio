import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, to } = body;

    // Validar os campos obrigatórios
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Configuração do Nodemailer com Gmail
    const gmailUser = process.env.GMAIL_USER || 'lucasmac.dev@gmail.com';
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailPass) {
      return NextResponse.json(
        { error: 'Configuração de email incompleta. Senha de aplicativo do Gmail não configurada.' },
        { status: 500 }
      );
    }

    // Criar transportador do Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // Configurar o email
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: to || gmailUser,
      subject: `[Contato do Portfolio] ${subject}`,
      replyTo: email,
      text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2>Nova mensagem do seu portfolio</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #0ea5e9;">
            <p><strong>Mensagem:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `
    };

    // Enviar o email
    try {
      await transporter.sendMail(mailOptions);
      
      return NextResponse.json(
        { success: true, message: 'Email enviado com sucesso' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      return NextResponse.json(
        { error: 'Falha ao enviar email. Verifique as configurações do Gmail.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}