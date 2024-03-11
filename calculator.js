let utils = {}; //create a namespace for our utility functions

//get function to make an HTTP GET request
utils.get = (url) => {

    //start promise object
    return new Promise(function (resolve, reject) {

        //create a new XMLHttpRequest object
        let request = new XMLHttpRequest();

        //initialize the request
        request.open('GET', url);

        request.onload = function () {
            //resolve on success
            if (request.status == 200) { // HTTP: OK
                console.log('Response OK');
                resolve(request.response);
            }
            //reject on error
            else {
                reject(Error(`promise error with ${request.status}`))
            }
        };
        //handle network errors
        request.onerror = function (error) {
            reject(Error(`Network Error with ${url}: ${error}`))
        };
        //send the request
        request.send();
    }); //end Promise Object
}

//getJSON function to get JSON data from the server
utils.getJSON = async function (url) {
    let string = null;
    //get the JSON string from the server
    try {
        string = await utils.get(url);
    }
    catch (error) {
        console.log(error)
    }
    //parse the JSON string and return the data
    let data = JSON.parse(string);
    return data;
}

async function init() {
    //get the root element of the web page
    let root = document.querySelector('#root');

    //create a variable to hold the URL of the JSON data source
    let url = 'https://api-demo.cartwebapp.com/data/2024';

    //create a variable to hold the JSON data
    let occupations = null;

    //try to retrieve the JSON data from the server
    try {
        //retrieve the JSON data from the server
        occupations = await utils.getJSON(url);
    }
    //catch any errors and display them in the root element
    catch (error) {
        root.style.color = 'red';
        root.textContent = `error: ${error}`;
    }

    //show JSON data on the html page
    root.innerHTML = buildList(occupations);
}

function buildList(jobs) {
    //create an empty string to hold the HTML
    let html = '';
    //loop through the array of job objects retrieved from the JSON data
    for (let job of jobs) {

        //start an HTML section for each job


        /* An alternative way of looping through each item in the data, not as useful for this assignment but something to keep in mind for a story? ... */
        //loop through each entry and create a div for each key:value pair
        // for (let key in job) {
        //     html += `<div><strong>${key}</strong>: ${job[key]}</div > `;
        // }

        //create a div element for the job title
        html += `<button class="visible bttn" type="button" onclick="sal(${job.salary})" id="${job.occupation.replaceAll(` `, `-`)}">${job.occupation}<br>$${job.salary.toLocaleString('en-US')}</button>`;

        // replaces empty spaces to hyphens
        // console.log(job.occupation.replaceAll(` `, `-`))

    }

    //return the completed html
    return html;
}

//initialize the web page when the DOM is ready
document.addEventListener('DOMContentLoaded', init);

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById(`search`).addEventListener(`input`, function (e) {
        let v = e.target.value;
        let vl = v.length;
        let jobs = document.getElementsByClassName(`bttn`);
        for (let i = 0; i < jobs.length; i++) {
            // console.log(jobs[i].id.toLocaleLowerCase().replaceAll(`-`, ` `))
            let j = jobs[i].id.toLocaleLowerCase().replaceAll(`-`, ` `).slice(0, vl);
            if (v === j) {
                vis(true)
            } else {
                vis(false)
            }
            function vis(value) {
                let job = document.getElementsByClassName(`bttn`)[i];
                job.classList = "bttn"; // clear classes on each function call
                switch (value) {
                    case true:
                        job.classList.add('visible')
                        break;
                    case false:
                        job.classList.add('invis');
                        break;
                }
            }
        }
    });

    let deductions = document.getElementsByName(`ptax`);
    for (let i = 0; i < deductions.length; i++) {
        let ddecId = (deductions[i].id)
        document.getElementById(`${ddecId}`).addEventListener(`input`, function (e) {
            dCalc();
        })
    }

    let deductions1 = document.getElementsByName(`tax`);
    for (let i = 0; i < deductions1.length; i++) {
        let ddecId = (deductions1[i].id)
        document.getElementById(`${ddecId}`).addEventListener(`input`, function (e) {
            dCalc();
        })
    }

    function dCalc() {
        let deductions = document.getElementsByName(`ptax`);
        let salary = document.getElementById(`monthlyIncome`).value;
        let msal = roundth(salary);
        let md = document.getElementById(`medInsure`).value;
        // Changes md to number
        md = roundth(md);
        let sum = [];
        for (let i = 0; i < deductions.length; i++) {
            let dValue = (deductions[i].value)
            let percent = ((Math.round((dValue) * 100)) / 10000)
            sum.unshift(roundth(percent * msal))
        }
        let add = sum.reduce((a, b) => (a + b))
        add = roundth(add) + md;
        let sub = msal - add;
        sub = roundth(sub);
        let netI = document.getElementById(`netI`)
        netI.classList = "sudoin";
        if (sub > 0) {
            netI.innerText = sub;
            netI.classList.add(`green`)
        } else {
            netI.innerText = sub;
            netI.classList.add(`red`)
        }
        // console.log(msal,sub)
    }

    let expenses = document.getElementsByName(`exp`);
    for (let i = 0; i < expenses.length; i++) {
        let ddecId = (expenses[i].id)
        document.getElementById(`${ddecId}`).addEventListener(`input`, function (e) {
            eCalc();
        })
    }

    function eCalc() {
        let expenses = document.getElementsByName(`exp`);
        let mInc = document.getElementById(`netI`).innerHTML;
        mInc = mInc.split(``).slice(0, mInc.length + 1).join(``);
        mInc = roundth(mInc);
        let sum1 = [];
        for (let i = 0; i < expenses.length; i++) {
            let eValue = (expenses[i].value)
            sum1.push(roundth(eValue))
        }
        let totSub = sum1.reduce((a, b) => (a + b))
        totSub = mInc - roundth(totSub);
        totSub = roundth(totSub);
        let total = document.getElementById(`total`)
        total.classList = "sudoin";
        if (totSub > 0) {
            total.innerText = totSub;
            total.classList.add(`green`)
        } else {
            total.innerText = totSub;
            total.classList.add(`red`)
        }
        // console.log(totSub,mInc)
    }




});

function sal(salary) {
    document.getElementById(`monthlyIncome`).value = roundth(salary / 12);
    // Calculates deductions after the button is click
    let msal = roundth(salary / 12);
    let deductions = document.getElementsByName(`ptax`);
    let md = document.getElementById(`medInsure`).value;
    // Changes md to number
    md = roundth(md);
    let sum = [];
    for (let i = 0; i < deductions.length; i++) {
        let dValue = (deductions[i].value)
        let percent = ((Math.round((dValue) * 100)) / 10000)
        sum.unshift(roundth(percent * msal))
    }
    let add = sum.reduce((a, b) => (a + b))
    add = roundth(add) + md;
    let stotal = msal - add;
    stotal = roundth(stotal);
    let netI = document.getElementById(`netI`)
    netI.classList = "sudoin";
    if (stotal > 0) {
        netI.innerText = stotal;
        netI.classList.add(`green`)
    } else {
        netI.innerText = stotal;
        netI.classList.add(`red`)
    }
    let expenses = document.getElementsByName(`exp`);
    let mInc = document.getElementById(`netI`).innerHTML;
    mInc = mInc.split(``).slice(0, mInc.length + 1).join(``);
    mInc = roundth(mInc);
    let sum1 = [];
    for (let i = 0; i < expenses.length; i++) {
        let eValue = (expenses[i].value)
        sum1.push(roundth(eValue))
    }
    let totSub = sum1.reduce((a, b) => (a + b))
    totSub = mInc - roundth(totSub);
    totSub = roundth(totSub);
    let total = document.getElementById(`total`)
    total.classList = "sudoin";
    if (totSub > 0) {
        total.innerText = totSub;
        total.classList.add(`green`)
    } else {
        total.innerText = totSub;
        total.classList.add(`red`)
    }
}

function roundth(number) {
    return ((Math.round((number) * 100)) / 100)
}
