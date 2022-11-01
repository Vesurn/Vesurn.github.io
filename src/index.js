"use strict"

// Global variables
 const questionList = document.querySelector("#question-list")
 const axisList = document.querySelector("#axis-list")
 

 createQuestion()
 function createQuestion() {
     const li = questionList.appendChild(document.createElement("li"))
     li.classList.add("question-item")
     const template = document.querySelector("#question-template")
     li.appendChild(template.content.cloneNode(true))
     
     const addAnswerButton = li.querySelector("#add-answer-button")
     // Focus on the question input span element after creating a question
     li.querySelector("#question-text").focus()

     //Append previously applied axis names
     submitAxises()

     createAnswer(li.querySelector("#answer-list"))

     addAnswerButton.onclick = () => {
         createAnswer(li.querySelector("#answer-list"))
     }

 }

 function createAnswer(answerList) {
     const li = answerList.appendChild(document.createElement("li"))
     li.classList.add("answer-item")
     const template = document.querySelector("#answer-template")
     li.appendChild(template.content.cloneNode(true))
     li.querySelector("#answer-text").focus()
 }

 createAxis()
 function createAxis() {
     const li = axisList.appendChild(document.createElement("li"))
     li.classList.add("axis-item")
     const template = document.querySelector("#axis-template")
     li.appendChild(template.content.cloneNode(true))
     
     const input = li.querySelector("input")
     input.focus()
     input.addEventListener("keydown", event => {
         if (event.key === "Enter") {
             submitAxises()
             createAxis()
         }
     })
 }

 function submitAxises() {
     const selectArray = Array.from(document.querySelectorAll("select"))
     // Remove all existing children
     selectArray.forEach(select => {
         Array.from(select.children)?.forEach(option => option.remove())
     })
     const axises = Array.from(axisList.querySelectorAll("li"))
         .map(li => li.children[0].value)
     
     const select = document.createElement("select")
     
     axises.forEach(axis => {
         const option = select.appendChild(document.createElement("option"))
         option.innerHTML = axis
         option.value = axis
         
         selectArray.forEach(select => {
             
             select.appendChild(option.cloneNode(true))
         })
     })
     
 }

 class Question {
     constructor(questionText, Answers, axis) {
         this.questionText = questionText
         this.answers = answers
         this.axis = axis
     }
 }
 class Answer {
     constructor(answerText, value) {
         this.answerText = answerText
         this.value = value
     }
 }

 function readForm() {
     const questions = Array.from(questionList.querySelectorAll(".question-item"))
     console.log(questions.map(question => questionToObject(question)))
     return questions.map(question => questionToObject(question))
 }

 function questionToObject(question) {
     const answerList = Array.from(question.querySelectorAll(".answer-item"))
     const answers = answerList.map(li => {
         return {
             answerText: li.querySelector("#answer-text").innerHTML,
             value: li.querySelector("#answer-value").value
         }
     })

     return {
         questionText: question.querySelector("#question-text").innerHTML,
         axis: question.querySelector("#axis-select").value,
         answers: answers
     }
 }

 function download(filename, text) {
     var element = document.createElement('a');
     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
     element.setAttribute('download', filename);

     element.style.display = 'none';
     document.body.appendChild(element);

     element.click();

     document.body.removeChild(element);
 }
 
 const downloadButton = document.querySelector("#download")
 downloadButton.onclick = () => download("questions.json", JSON.stringify(readForm(), null, 2))