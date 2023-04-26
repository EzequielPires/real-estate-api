import * as nodemailer from "nodemailer";

interface SendEmailProps {
    email: string;
    body?: string;
    title?: string;
    token: string;
}

export class NodemailerService {
    constructor() { }

    async sendEmail({ email, body, title, token }: SendEmailProps) {
        try {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAUTH2',
                    user: 'ezequiel.pires082000@gmail.com',
                    pass: '2Corintios12910',
                    clientId: '1035429315942-q1fl63548jc9sojc86ipggi48cfjcq5h.apps.googleusercontent.com',
                    clientSecret: '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',
                    refreshToken: '1//04k_Rr_MF7WjJCgYIARAAGAQSNwF-L9IryPDB9Jhq2j14vZuH8xXXTukC8MoYrhGGKw0prhQxpXBWMKdrgIAvCnvTTI6wVD9gXMs',
                }
            })
            let info = await transporter.sendMail({
                from: 'noreply@portalcatalao.com.br',
                to: email,
                subject: title,
                text: title,
                html: `
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Recuperação de Senha</title>
                    <style>
                      body {
                        background-color: #f2f2f2;
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 1.5;
                        color: #333;
                      }
            
                      .container {
                        margin: 0 auto;
                        max-width: 600px;
                        padding: 20px;
                        background-color: #fff;
                      }
            
                      h1 {
                        font-size: 28px;
                        margin-top: 0;
                      }
            
                      p {
                        margin-top: 0;
                      }
            
                      .btn {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #fff !important;
                        text-decoration: none;
                        border-radius: 5px;
                      }
            
                      .btn:hover {
                        background-color: #0062cc;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h1>Recuperação de Senha</h1>
                      <p>Olá,</p>
                      <p>Recebemos uma solicitação para redefinir sua senha. Para continuar o processo de redefinição de senha, clique no botão abaixo:</p>
                      <a href="${body}" class="btn">Redefinir Senha</a>
                      <p>Se você não solicitou a redefinição de senha, ignore este e-mail e sua senha permanecerá a mesma.</p>
                      <p>Atenciosamente,<br>Sua equipe de suporte</p>
                    </div>
                  </body>
                </html>
              `,
            })

            return {
                success: true,
                message: info.response
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
    async sendEmailPaymentInvoice({ email, title, price, date }) {
        try {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAUTH2',
                    user: 'ezequiel.pires082000@gmail.com',
                    pass: '2Corintios12910',
                    clientId: '1035429315942-q1fl63548jc9sojc86ipggi48cfjcq5h.apps.googleusercontent.com',
                    clientSecret: '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',
                    refreshToken: '1//04k_Rr_MF7WjJCgYIARAAGAQSNwF-L9IryPDB9Jhq2j14vZuH8xXXTukC8MoYrhGGKw0prhQxpXBWMKdrgIAvCnvTTI6wVD9gXMs',
                }
            })
            let info = await transporter.sendMail({
                from: 'noreply@portalcatalao.com.br',
                to: email,
                subject: title,
                text: title,
                html: `
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Rotina imóveis - Aviso de Recebimento de Fatura</title>
                    <style>
                      body {
                        background-color: #f2f2f2;
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 1.5;
                        color: #333;
                      }
            
                      .container {
                        margin: 0 auto;
                        max-width: 600px;
                        padding: 20px;
                        background-color: #fff;
                      }
            
                      h1 {
                        font-size: 28px;
                        margin-top: 0;
                      }
            
                      p {
                        margin-top: 0;
                      }
            
                      .btn {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #fff !important;
                        text-decoration: none;
                        border-radius: 5px;
                      }
            
                      .btn:hover {
                        background-color: #0062cc;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h1>Recebimento de fatura</h1>
                      <p>Olá,</p>
                      <p>A Rotina imóveis vem através deste comunicar o recebimento no valor de R$ ${price} da fatura com vencimento em ${date}</p>
                      <p>Em caso de dúvidas, por favor, entre em contato conosco através dos seguintes canais de atendimento: (64) 98423-0113, rotinaimoveis@hotmail.com</p>
                      <p>Atenciosamente,<br>Sua equipe de suporte</p>
                    </div>
                  </body>
                </html>
              `,
            })

            return {
                success: true,
                message: info.response
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}