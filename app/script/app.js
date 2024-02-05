const questions = [
  "let me know your name, Buddy?",
  "Where are you from?",
  "How satisfied are you with the overall quality of our product?"
];

const API_BASE_URL = "https://api.surveysparrow.com/v3/";
const headers = {
  options: {
    headers: {
      Authorization: `Bearer <%= iparams.surveysparrow_api_key %>`,
    },
  },
};

var client;
init();
async function init() {
  client = await window.app.initialized();
}
const button = document.getElementById("btn");
const message = document.getElementById("msg");
button.onclick = createSurvey;

async function createSurvey() {
  try {
    button.innerHTML = "Your report is being created...";
    // Create the Survey
    const surveyId = await postSurvey();
    // Create questions for the Survey
    for (let question of questions) {
      await postQuestion(surveyId, question);
    }
    button.innerHTML = "Create";
    showNotificationMessage("Report Created Successfully", { type: "success" });
  } catch (error) {
    button.innerHTML = "Create";
    console.log("Error while creating the Report", error);
    showNotificationMessage("Error while Creating Survey", { type: "failure" });
  }
}


async function postSurvey() {
  const response = await client.request.post(`${API_BASE_URL}surveys`, headers, {
    name: "Instant Survey",
    survey_type: "ClassicForm",
  });
  const responseBody = JSON.parse(response.body);
  const surveyId = responseBody.data.id;
  return surveyId;
 // return JSON.parse(response).body.data.id;
}
async function postQuestion(surveyId, question) {
  await client.request.post(`${API_BASE_URL}questions`, headers, {
    survey_id: surveyId,
    question: {
      type: "TextInput",
      text: question,
    },
  });
}
function showNotificationMessage(message, options) {
  client.interface.alertMessage(message, options);
  if (options.type === "success") {
    message.innerHTML = "Please navigate to home screen to see newly created Reports.";
    setTimeout(() => {
      message.innerHTML = "";
    }, 3000);
  }
}