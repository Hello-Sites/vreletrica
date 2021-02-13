function headerColorControl({headerId, normal, inverted, pageTriggers}){

    const header = document.getElementById(headerId)
    const pageSections = document.getElementsByClassName('page-section')

    const colors = { false: normal, true: inverted }
    
    control()
    
    document.addEventListener('scroll', control)
        //banner.offsetHeight <  window.pageYOffset + header.offsetHeight
    
    function control () {
    const currentSection =  Array.from(pageSections).map( (section, i, arr)=> {
        section.y = section.getBoundingClientRect().y
        section.end = section.getBoundingClientRect().bottom

        for(const elem of arr){
            elem.y = elem.getBoundingClientRect().y
            
            //TODO: Aumentar o trigger para que quando clicar no link já mudar a cor do header.
            if(section.y - header.offsetHeight < elem.y && section.y <= 0 + header.offsetHeight && section.end >= 0){
                return Object.assign(section, {bg: getComputedStyle(section).backgroundColor})
            }
        }
    }).filter((elem)=> {return elem !== undefined})[0]

    function onTrigger (){
        if(currentSection && pageTriggers){
            for(const trigger of pageTriggers){
                if(trigger.split(' ').join('') === currentSection.bg.split(' ').join('')){
                    return true
                }
            }
        }
        return false
    }

    const currentColors = {
        header: colors[onTrigger()]
    }
    
    
    if(getComputedStyle(header, null).backgroundColor.split(' ').join('') !== currentColors.header.split(' ').join('')){
    	changeBackgroundColor( {
            from: getComputedStyle(header,null).backgroundColor, to: currentColors.header,
            element: header
        })
    }

    for(const elem of Array.from(document.getElementsByClassName('inverse-'+headerId)) ){

if( onTrigger() ){
	elem.classList.add('inversed')
}else{
	elem.classList.remove('inversed')
}
    }

}
}


function changeBackgroundColor({from, to, element})  {
    element.animate([ {backgroundColor: from}, {backgroundColor: to}],
    {
        duration: 100,
        fill: 'forwards'
    }
    )
}

function smoothScroll(){
    
    const unsupported = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
    
    for(const platform of unsupported){
        if(navigator.userAgent.match(platform)){
            console.warn('Smooth scrolling has been disabled for your device.')
            return
        }
    }
    
    const items = {
        links: document.getElementsByTagName('a'),
        buttons: document.getElementsByTagName('button'),
        generic: document.getElementsByClassName('smooth-scroll'),
        images: document.getElementsByTagName('img')
    }

    for(const type in items){
        for(const item of items[type]){
            const targetId = item.getAttribute('href') || item.getAttribute('goto')
            
            if(targetId && targetId !== "#"){
                item.smoothScrollTarget = targetId
                item.onclick = ''
                item.addEventListener('click', scrollToObject)
            }else{
                item.smoothScrollTarget = "#body"
            }
        }
    }

    function scrollToObject(event){
        event.preventDefault()

        const element = event.originalTarget.smoothScrollTarget? event.originalTarget: false
        const targetElement = document.getElementById(element.smoothScrollTarget.slice(1))
        const target = targetElement? targetElement.offsetTop : 0

        const header = document.getElementById('page-header')
        const padding = header? header.clientHeight : 0

        window.scroll({
            top: target - padding,
            behavior: 'smooth'
        })

    }
}

function controllAppearSections() {
    const sections = document.getElementsByClassName('starts-hidden')
    for(const section of sections) {
        section.top = section.offsetTop
        section.style.opacity = 0
    }

    document.onscroll = checkAndDisplay

    function checkAndDisplay(){
        const scrolled = (document.getElementById('page-banner').getBoundingClientRect().y * -1) + window.innerHeight
        for(const section of sections){
            if(scrolled > section.top && Array.from(section.classList).includes('appear') === false){
                section.classList.add('appear')
            }
        }
    }
}

