export const loginCode = ({ code }) => `
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Código de Verificação para Login - LifeShots</title>
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

        #button-copy {
          background-color: #3b82f6;
          transition: all 100ms ease-in-out;
        }

        #button-copy:active {
          background-color: #1d4ed8;
          scale: 1.1;
        }
      </style>
    </head>
    <body>
      <main style="max-width: 840px; width: 100%; height: 100vh; margin: auto">
        <header style="width: 100%; padding: 20px 0; background-color: #3b82f6">
          <div style="width: 100%; height: 100%">
            <h1 style="color: #fafafa; font-size: 28px; padding-left: 20px">LifeShots - Código de Verificação</h1>
          </div>
        </header>
        <section style="width: 100%; height: 100%; margin: auto">
          <div style="padding: 10px 40px">
            <h3 style="color: #09090b; font-size: 24px; font-weight: 800; margin: 30px 0">Olá</h3>
            <p style="color: #27272a; margin: 20px 0">
              Recebemos uma solicitação para fazer login em sua conta no LifeShots. Para concluir o processo, insira o código de verificação abaixo:
            </p>
            <div style="padding: 20px; background-color: #d4d4d8; margin: 0 10px">
              <p id="code" style="color: #18181b; font-weight: 800; font-size: 27px; letter-spacing: 1.5px; text-align: center">${code}</p>
            </div>
            <ul style="padding-left: 20px; margin: 20px 0">
              <li style="padding-bottom: 10px">
                <p style="color: #52525b; font-size: 14px; font-weight: 500">Este código expira em 15 minutos.</p>
              </li>
              <li>
                <p style="color: #52525b; font-size: 14px; font-weight: 500">
                  Se você não fez essa solicitação, ignore este e-mail. Caso contrário, você pode continuar a acessar sua conta normalmente.
                </p>
              </li>
            </ul>
            <p style="color: #27272a; margin-bottom: 4px">Atenciosamente,</p>
            <p style="color: #18181b; font-weight: 800; font-size: 18px">LifeShots</p>
          </div>
        </section>
      </main>
    </body>
    <script>
      const code = document.querySelector("#code");
      const buttonCopy = document.querySelector("#button-copy");

      const handleCopy = () => {
        const range = document.createRange();
        range.selectNode(code);

        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        try {
          document.execCommand("copy");
        } catch {
          return;
        }

        window.getSelection().removeAllRanges();
      };

      buttonCopy.addEventListener("click", handleCopy);
    </script>
  </html>
`;
