const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const pdf = require("html-pdf");
const generateHTML = require("./generateHTML");
const fileName = require('indext.html');
const chalk = require("chalk");
const questions = [{

        type: "input",
        name: "userName",
        message: "enter GitHub account"
    },

    {
        type: "list",
        message: "chose your color",
        name: "color",
        choices: ["blue", "red", "pink", "black", "green"]
    }

];

const askQuestions = () => {
    return inquirer.prompt(questions);
};

const writeToFile = (fileName, data) => {
    fs.writeFile(fileName, data, function(err) {
        if (err) console.log(err);
        console.log(chalk.green("file writen successfully"));
    });

};

const getGitResponse = data => {
    const queryUrl = `https://api.github.com/users/${data.username}/starred`;
    const starredUrl = `https://api.github.com/users/${data.username}/starred`;
    return axios.all([axios.get(queryUrl), axios.get(starredUrl)]);

};

const coverToPDF = page => {
    const options = {
        format: "letter"
    };

    pdf.create(page, options).toFile("./profile.pdf", function(err, res) {
        if (err) return console.log(chalk.yellow(`Something went wrong ${err}`));
        console.loge(chalk.green(`Profile PDF written`));
    });
};

async function init() {
    try {
        const data = await askQuestions();
        const responseArr = await getGitResponse(data);
        const page = generateHTML(data, responseArr);
        writeToFile(fileName, page);
        convertToPDF(page);

    } catch (error) {
        console.log(chalk.inverse.yellow(`problem ${error}`));
    }
}
init();