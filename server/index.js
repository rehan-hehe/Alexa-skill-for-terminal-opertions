const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Rehan’s laptop!');
});

app.post('/run-command', (req, res) => {
  const request = req.body.request;

  // Handle LaunchRequest (e.g., when user opens the skill)
  if (request && request.type === 'LaunchRequest') {
    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Welcome! You can say something like 'run command ls' to get started."
        },
        shouldEndSession: false
      }
    });
  }

  // Handle IntentRequest (e.g., when user says "run command ls")
  if (request && request.type === 'IntentRequest') {
    const intent = request.intent;
    let command = intent?.slots?.app?.value;

    if (command) {
      command=command.toLowerCase()
      exec(command, (error, stdout, stderr) => {
        let responseSpeech;

        if (error) {
          responseSpeech = `There was an error running the command`;
        } else {
          responseSpeech = `Command executed successfully. Output: ${stdout}`;
        }

        res.json({
          version: "1.0",
          response: {
            outputSpeech: {
              type: "PlainText",
              text: responseSpeech
            },
            shouldEndSession: true
          }
        });
      });
    } else {
      res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: "Sorry, I didn't catch the command."
          },
          shouldEndSession: false
        }
      });
    }

    return; // Make sure we don't fall through to the default handler
  }

  // Fallback for unknown request types
  res.json({
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: "This is not a valid request."
      },
      shouldEndSession: true
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
