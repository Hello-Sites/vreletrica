const submittedForms = []

async function successfullySubmittedForm (id) {
    const form = document.getElementById(id)
    const sucessMsg = document.getElementById((id+'-sucess-message'))

    if(submittedForms.includes(form.id)){
        return
    }else{
        submittedForms.push(form.id)
        await hideElementWithFade(form)
        form.style.display = 'none'
        sucessMsg.style.display = 'block'
        await appearElement(sucessMsg)
    }
}

function appearElement(htmlElement) {
    return new Promise( (accept)=> {
        htmlElement.animate([
            // keyframes
            { opacity: '0' },
            { opacity: '1' },
        ], {
            // timing options
            duration: 1000,
            fill: 'forwards'
        });

        setTimeout( ()=> {
        accept()
    },1000)
    })
}

function hideElementWithFade(htmlElement) {
    return new Promise( (accept)=> {
        htmlElement.animate([
            // keyframes
            { opacity: '1' },
            { opacity: '0' },
        ], {
            // timing options
            duration: 1000,
            fill: 'forwards'
        });

        setTimeout( ()=> {
        accept()
    },1000)
    })
}

function checkValidEmail(id) {
const input = document.getElementById(id)
   const checker = setInterval ( () => {
       const email = input.value
       const a = email.search('@')
       if(a > 0 && a < email.length-1){
        const d = email.split('').filter((e, i)=> {return e === '.'}).length
        if(d > 0){
            input.pattern = email
        }else{
            input.pattern = Math.random()
        }
       }
   },100)
}

function showSendingMessage(id) {
    let times = 0
    let dots = ['', '.', '..', '...']
    const button = document.getElementById((id+'-button'))

    const repeat = setInterval(()=> {
    if(times < 3){
        times++
    }else{
        times = 0
    }
    button.innerHTML = 'Enviando' + dots[times]

    if(submittedForms.includes(id)){
     button.innerHTML = 'Enviado!'
     clearInterval(repeat)
    }
    }, 60)
}