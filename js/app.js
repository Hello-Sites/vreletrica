function headerColorControl({headerId, bannerId, normal, inverted}){

    const header = document.getElementById(headerId)
    const banner = document.getElementById(bannerId) || header.parentElement

    const color = { false: normal, true: inverted }

    document.addEventListener('scroll', () => {

        const isBelow = banner.offsetHeight <  window.pageYOffset + header.offsetHeight

        changeBackgroundColor({
            element: header,
            from: getComputedStyle(header, null).getPropertyValue("background-color"), to: color[isBelow] })


        for (const child of Array.from(document.getElementsByClassName('inverse-'+headerId)) ){
            if(isBelow){
                child.classList.add('inversed')
            }else{
                child.classList.remove('inversed')
            }

        }

    })
}



function changeBackgroundColor({from, to, element})  {
    element.animate([ {backgroundColor: from}, {backgroundColor: to}],
    {
        duration: 200,
        fill: 'forwards'
    }
    )
}

function smoothScroll(){
    const items = {
        links: document.getElementsByTagName('a'),
        buttons: document.getElementsByTagName('button'),
        generic: document.getElementsByClassName('smooth-scroll')
    }

    console.log(items)

    for(const type in items){
        for(const item of items[type]){
            const targetId = item.getAttribute('onclick') ||  item.getAttribute('href') || item.getAttribute('goto')
            if(targetId && targetId !== "#"){
                item.smoothScrollTarget = targetId
                item.addEventListener('click', scrollToObject)
            }else{
                item.smoothScrollTarget = "#top"
                console.warn('Scroll: Target is '+targetId+':', item.outerHTML, '\n', Array.from(document.all).indexOf(item) + 'º Element')
            }
        }
    }

    function scrollToObject(event){
        event.preventDefault()

        const element = event.originalTarget.smoothScrollTarget? event.originalTarget: false
        const targetElement = document.getElementById(element.smoothScrollTarget.slice(1))
        const target = targetElement? targetElement.offsetTop : 0

        console.info('goning to:', element.smoothScrollTarget)

        const header = document.getElementById('page-header')
        const padding = header? header.clientHeight : 0

        window.scroll({
            top: target - padding,
            behavior: 'smooth'
        })

    }
}

function controllAppearSections() {
    const sections = document.getElementsByClassName('start-hidden')
    for(const section of sections) {
        const displayKey = getComputedStyle(section, null).display
        section.displaySave = displayKey
        section.top = section.offsetTop
        section.style.display = 'none'
        sections.items = section
    }

    document.onwheel = checkAndDisplay

    function checkAndDisplay(){
        const scrolled = (document.getElementById('page-banner').getBoundingClientRect().y * -1) + window.innerHeight
        for(const section of sections){
            if(scrolled >= section.top){
               section.style.display = section.displaySave
            }
        }
    }
}

