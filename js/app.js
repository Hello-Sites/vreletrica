function createApp () {
        const publicKey = {
            currentSection : undefined,
            mobile: undefined
        }
        
        function headerColorControl ( {headerId, normal, inverted, pageTriggers} ){

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

                const padding = window.innerWidth <= 465 ? -40 : 20
                if(section.y < header.offsetHeight + padding && section.end > header.offsetHeight + padding){
                    return Object.assign(section, {bg: getComputedStyle(section).backgroundColor})
                }

            }).filter((elem)=> {return elem !== undefined})[0]
            publicKey.currentSection = currentSection

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
                navColors()
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

        const platforms = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i]
        const unsupported = platforms.filter (  (plat) => { return navigator.userAgent.match(plat)} ).length > 0 
        
            if(unsupported){
                publicKey.mobile = '' + navigator.platform
                console.warn('Smooth scrolling has been disabled for your device.')
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
            if(unsupported === false) {
                        item.smoothScrollTarget = targetId
                        item.onclick = ''
                        item.addEventListener('click', scrollToObject)	
            }
                item.onclick = function () {hideMobileMenu()}

                }else{
                    item.smoothScrollTarget = "#body"
                }
            }
        }

        function scrollToObject(event){
            event.preventDefault()

            const element = event.originalTarget.smoothScrollTarget? event.originalTarget: false
            if(element === false){ return}
            const targetElement = document.getElementById(element.smoothScrollTarget.slice(1))
            const target = targetElement? targetElement.offsetTop : 0

            const header = document.getElementById('page-header')
            const  padding = window.innerWidth <= 786 ? -header.clientHeight/2 : 0

            const headerSize = header? header.clientHeight + padding : 0


            window.scroll({
                top: target - headerSize,
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

    function navColors () {
        if(publicKey.currentSection){
        NavLink = Array.from(document.getElementsByClassName('nav-link')).filter( (link)=> {
            const active = publicKey.currentSection.id === link.getAttribute('href').slice(1)
            if(active === false){ link.classList.remove('active')}
            return active

        })[0]

        NavLink.classList.add('active')

        }else{
            for(const link of document.getElementsByClassName('nav-link')){
                link.classList.remove('active')
            }
        }
    }

    function mobileMenu () {
        document.getElementById('header-nav-menu').onclick = function () {
            header = document.getElementById('page-header')
            if(Array.from(header.classList).includes('open')){
                hideMobileMenu()
            }else{
                showMobileMenu()
            }
        }
    }
    
    function showMobileMenu() {
        header = document.getElementById('page-header')
        header.classList.add('open')
    }

    function hideMobileMenu() {
        header = document.getElementById('page-header')
        header.classList.remove('open')
    }

    function writeStyle() {

    }

    return {
        publicKey,
        headerColorControl,
        smoothScroll,
        controllAppearSections,
        navColors,
        writeStyle,
        mobileMenu,
    }
}



const app = createApp()

app.headerColorControl({
    headerId: 'page-header',
    normal: 'rgb(255,255,255)',
    inverted: 'rgb(34,34,34)',
    pageTriggers: ['rgb(255,255,255)']
})

app.smoothScroll()
app.controllAppearSections()
app.navColors()
app.writeStyle()

app.mobileMenu()
