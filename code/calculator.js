function onKeyPressed(event) {
    const screen = document.getElementById('screen');
    const value = event.target.innerText;

    if (value === 'AC') {
        screen.value = '';
    } else if (value === 'DEL') {
        screen.value = screen.value.slice(0, -1);
    } else if (value === '=') {
        try {
            screen.value = eval(screen.value);
        } catch (e) {
            screen.value = 'Error';
        }
    }
    else if (screen.value === '0') {
        screen.value = value;
    } else {
        screen.value += value;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const buttons = [...document.getElementsByTagName('button')];

    for (let button of buttons) {
        button.addEventListener('click', onKeyPressed);
    }
});
