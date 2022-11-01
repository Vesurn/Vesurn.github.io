"use strict"

// Global variables
const questionList = document.querySelector("#question-list")
const axisList = document.querySelector("#axis-list")


createQuestion()
function createQuestion({questionText: questionText = "", axis: axis = "", answers: answers = []} = {}) {
    const li = questionList.appendChild(document.createElement("li"))
    li.classList.add("question-item")
    const template = document.querySelector("#question-template")
    li.appendChild(template.content.cloneNode(true))
    const answerList = li.querySelector("#answer-list")
    const addAnswerButton = li.querySelector("#add-answer-button")
    // Focus on the question input span element after creating a question
    li.querySelector("#question-text").focus()

    //Append previously applied axis names
    submitAxises()

    //Create an empty answer if no object is passed as parameter
    if (arguments.length === 0) {
        createAnswer(answerList)
    }

    addAnswerButton.onclick = () => {
        createAnswer(answerList)
    }

    // Render the question with the values provided
    li.querySelector("#question-text").innerHTML = questionText
    li.querySelector("#axis-select").value = axis
    answers.forEach(answer => {
        createAnswer(answerList, answer)
    })

    return li
}

function createAnswer(answerList, {answerText: answerText = "", value: value = 0} = {}) {
    
    const li = answerList.appendChild(document.createElement("li"))
    li.classList.add("answer-item")
    const template = document.querySelector("#answer-template")
    
    li.appendChild(template.content.cloneNode(true))
    li.querySelector("#answer-text").focus()

    li.querySelector("#answer-text").innerHTML = answerText
    li.querySelector("#answer-value").value = +value

    return li
}

createAxis()
function createAxis(axis = "") {
    const li = axisList.appendChild(document.createElement("li"))
    li.classList.add("axis-item")
    const template = document.querySelector("#axis-template")
    li.appendChild(template.content.cloneNode(true))

    const input = li.querySelector("input")
    input.value = axis
    input.focus()
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            submitAxises()
            createAxis()
        }
    })

    return li
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
    constructor(questionText, answers, axis) {
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


const uploadInput = document.querySelector("#upload")
uploadInput.addEventListener("change", function() {
    const file = this.files[0]

    // Read the contents of the file
    const reader = new FileReader()
    reader.onload = (e) => {
        renderJSON(e.target.result)
    }
    reader.readAsText(file)
})

function renderJSON(json) {
    if (arguments.length === 0) throw new Error("No arguments provided")
    let questions = json
    if (typeof json === "string") {
        questions = JSON.parse(json)
    }
    
    Array.from(axisList.children).forEach(child => child.remove()) // Remove all axises before rendering
    getAxises(questions).forEach(axis => createAxis(axis))

    Array.from(questionList.children).forEach(child => child.remove()) // Remove all question items before rendering
    questions.forEach(question => {
        createQuestion(question)
    })
}

function getAxises(questionsObj) {
    const axises = new Set()
    questionsObj.forEach(question => {
        axises.add(question.axis)
    })
    return Array.from(axises)
}

