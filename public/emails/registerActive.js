export const registerActive = ({ activeLink }) => `
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Ative sua conta no LifeShots</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Inter", sans-serif;
        }

        button {
          border: none;
          outline: none;
          cursor: pointer;
        }

        a {
          background-color: #3b82f6;
          transition: all 100ms ease-in-out;
        }

        a:active {
          background-color: #1d4ed8;
          scale: 1.1;
        }
      </style>
    </head>
    <body>
      <main style="height: 100vh; width: 100%; max-width: 840px; margin: auto">
        <header style="width: 100%; padding: 20px 0; background-color: #3b82f6">
          <div style="width: 100%; height: 100%">
            <h1 style="color: #fafafa; font-size: 28px; padding-left: 20px">LifeShots - Ativar Conta</h1>
          </div>
        </header>
        <section style="width: 100%; height: 100%">
          <div style="padding: 10px 40px">
            <h3 style="color: #09090b; font-size: 24px; font-weight: 800; margin: 30px 0">Olá</h3>
            <p style="color: #27272a; margin: 20px 0">
              Bem-vindo ao LifeShots! Estamos muito felizes em tê-lo conosco. Para ativar sua conta e começar a aproveitar todas as funcionalidades da nossa plataforma, basta clicar
              no botão abaixo:
            </p>
            <div style="padding: 20px; background-color: #d4d4d8; margin: 0 10px; text-align: center">
              <a target="_blank" href="${activeLink}" style="border-radius: 5px; padding: 10px; color: #fafafa; cursor: pointer; text-decoration: none">Ativar conta</a>
            </div>
            <ul style="padding-left: 20px; margin: 20px 0">
              <li style="padding-bottom: 10px">
                <p style="color: #52525b; font-size: 14px; font-weight: 500">Este link é válido por 15 horas. Após esse período, você precisará se cadastrar novamente.</p>
              </li>
              <li>
                <p style="color: #52525b; font-size: 14px; font-weight: 500">
                  Se você não realizou este cadastro, ignore este e-mail. Sua conta permanecerá inativa e será automaticamente removida após um período de segurança.
                </p>
              </li>
            </ul>
            <p style="color: #27272a; margin-bottom: 4px">Atenciosamente,</p>
            <p style="color: #18181b; font-weight: 800; font-size: 18px">LifeShots</p>
          </div>
        </section>
      </main>
    </body>
  </html>
`;
