import { quizdata } from './ques.js';
let no = 0, score = 0, obj1, save = [], obj2, min = Math.floor(quizdata.length / 3), sec = 20, sec2 = 10;
let hasQuizEnded = false;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
shuffleArray(quizdata);

let btn = document.querySelectorAll('button');
btn[0].addEventListener("click", () => {
    document.getElementById('first').style.display = "none";
    document.getElementById('second').style.display = "block";
    nextques();
});

function startTimer() {
    document.getElementById('timer').innerText = `${sec > 9 ? sec : '0' + sec}`;
    document.getElementById('over').innerText = `${min > 9 ? min : '0' + min}:${sec2 > 9 ? sec2 : '0' + sec2}`;

    obj1 = setInterval(() => {
        sec--;
        if (sec == 0) {
            sec = 20;
            nextques();
        }
        document.getElementById('timer').innerText = `${sec > 9 ? sec : '0' + sec}`;

        if (no == quizdata.length + 1) {
            clearInterval(obj1);
            alert("Question End!");
            nextques();
        }
    }, 1000);

    obj2 = setInterval(() => {
        if (hasQuizEnded) return;

        if (min == -1 && !hasQuizEnded) {
            hasQuizEnded = true;
            clearInterval(obj1);
            clearInterval(obj2);
            document.getElementById('over').innerText = '00:00';
            alert("Time's Up!");
            no = quizdata.length;
            nextques();
        }

        sec2--;
        if (sec2 == 0) {
            min--;
            sec2 = 59;
        }
        document.getElementById('over').innerText = `${min > 9 ? min : '0' + min}:${sec2 > 9 ? sec2 : '0' + sec2}`;
    }, 1000);
}

function nextques() {
    no++;
    clearInterval(obj1);
    sec = 20;
    if (no <= quizdata.length) {
        document.getElementById('cont').innerHTML = "";
        document.getElementById('ques_num').innerText = "Quiz " + no;
        if (no == quizdata.length) {
            btn[1].innerText = "End";
        }

        let question = document.createElement('p');
        let div = document.createElement('div');
        question.innerText = quizdata[no - 1].ques;
        question.setAttribute("style", "font-size: 3vmax; font-weight: 900;");
        div.setAttribute("style", "display:flex;flex-direction:column;");
        quizdata[no - 1].opt.forEach((quiz_opt) => {
            let label = document.createElement('label');
            let radio = document.createElement('input');
            label.setAttribute("style", "font-size:2.5vmax;display:flex;flex-direction:row-reverse;justify-content:space-between;margin-top:1vmax;transform:scale(.8);");
            radio.setAttribute("type", "radio");
            radio.setAttribute("name", "question" + no);
            radio.setAttribute("value", quiz_opt);
            label.appendChild(radio);
            label.appendChild(document.createTextNode(quiz_opt));
            div.appendChild(label);
            label.addEventListener('mouseover', () => {
                label.setAttribute("style", "font-size:2.5vmax;display:flex;flex-direction:row-reverse;justify-content:space-between;margin-top:1vmax; border:1px solid rgb(0, 153, 255); border-radius:1vmax;transform:scale(1); background-color:rgb(53, 101, 129);");
            }); 
            label.addEventListener('mouseout', () => {
                label.setAttribute("style", "font-size:2.5vmax;display:flex;flex-direction:row-reverse;justify-content:space-between;margin-top:1vmax;transform:scale(.8);");
            });
        });
        document.getElementById('cont').appendChild(question);
        document.getElementById('cont').appendChild(div);
    } else {
        displayResults();
    }
    startTimer();
}

function displayResults() {
    document.getElementsByTagName('main')[0].innerHTML = "";
    let table = document.createElement('table');
    table.setAttribute("style", "width: 100%; border-collapse: collapse; margin-top: 2vmax; margin-bottom:5vmax;");

    let trhead = document.createElement('tr');
    let th1 = document.createElement('th');
    th1.innerText = "Question";
    th1.style.border = "1px solid royalblue";
    th1.style.padding = ".5vmax";
    th1.style.textAlign = "left";
    let th2 = document.createElement('th');
    th2.innerText = "Correct Answer";
    th2.style.border = "1px solid royalblue";
    th2.style.padding = ".5vmax";
    th2.style.textAlign = "left";
    let th3 = document.createElement('th');
    th3.innerText = "Your Answer";
    th3.style.border = "1px solid royalblue";
    th3.style.padding = ".5vmax";
    th3.style.textAlign = "left";

    trhead.appendChild(th1);
    trhead.appendChild(th2);
    trhead.appendChild(th3);
    table.appendChild(trhead);
    quizdata.forEach((quiz, index) => {
        let trrow = document.createElement('tr');
        let quescell = document.createElement('td');
        quescell.innerText = quiz.ques;
        quescell.style.border = "1px solid royalblue";
        quescell.style.padding = ".5vmax";

        let anscell = document.createElement('td');
        anscell.innerText = quiz.ans;
        anscell.style.border = "1px solid royalblue";
        anscell.style.padding = ".5vmax";

        let usercell = document.createElement('td');
        usercell.innerText = save[index] || "Not Answered";
        usercell.style.border = "1px solid royalblue";
        usercell.style.padding = ".5vmax";

        trrow.appendChild(quescell);
        trrow.appendChild(anscell);
        trrow.appendChild(usercell);
        table.appendChild(trrow);
    });
    let sc_brd = document.createElement('p');
    sc_brd.setAttribute("style", "color:yellow;text-align:center; font-size:5vmax;");
    sc_brd.innerText = "Quiz Finished! Your score is: " + score;

    let l_btn = document.createElement('button');
    l_btn.innerText = 'Reset';
    l_btn.addEventListener('click', resetfunc);
    document.getElementsByTagName('main')[0].appendChild(sc_brd);
    document.getElementsByTagName('main')[0].appendChild(l_btn);
    document.getElementsByTagName('main')[0].appendChild(table);
}

btn[1].addEventListener('click', () => {
    const selectedOption = document.querySelector(`input[name="question${no}"]:checked`);
    if (selectedOption) {
        save.push(selectedOption.value);
        if (selectedOption.value === quizdata[no - 1].ans) {
            score++;
        }
        nextques();
    } else {
        window.alert("Please Select");
    }
});

btn[2].addEventListener('click', () => {
    save.push("Skipped");
    nextques();
});

btn[3].addEventListener('click', resetfunc);
function resetfunc() {
    // location.reload();
    no = 0;
    score = 0;
    save = [];
    min = quizdata.length - 1;
    sec = 20;
    sec2 = 59;
    hasQuizEnded = false;
    shuffleArray(quizdata);
    clearInterval(obj1);
    clearInterval(obj2);
    document.getElementById('first').style.display = "block";
    document.getElementById('second').style.display = "none";
    document.getElementById('cont').innerHTML = "";
    document.getElementById('timer').innerText = "00";
    document.getElementById('over').innerText = "00:00";
    document.getElementById('ques_num').innerText = "";
}