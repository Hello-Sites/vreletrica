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

                if(targetId && targetId !== "#" && targetId.match('http') === false && targetId.match('https') === false){
            if(unsupported === false) {
                        item.smoothScrollTarget = targetId
                        item.onclick = ''
                        item.addEventListener('click', scrollToObject)	
            }
                item.addEventListener('click', hideMobileMenu())

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
    function writeStyle () {
        
    }
    
    function serviceSelector() {
        let sended = false
        
        const servicesSelected = {}
        const flyer = document.getElementById('service-flyer')
        const sendButton = document.getElementById('contact-service-select')
        const HiddenIframe = document.getElementById('hidden_iframe')
        const servicesPop = document.getElementById('pop-selected-services')
        const formList = document.getElementById('services-form-list')
        
        HiddenIframe.addEventListener('load', ()=> {
           if(document.getElementById('gform').submitted){
               for(const service of flyer.children){
                    service.classList.remove('service-selected')
                    service.onclick = null;
               }
           }
        })
        
        sendButton.addEventListener('click', ()=> {
            const services = Object.keys(servicesSelected).map( (e)=> {
                return {
                    name: servicesSelected[e].getAttribute('name'),
                    id: e
                }
                
            })
        
        document.getElementById('entry.151389908').value = services.map( e => {return e.name}).join(', ')
        
        Array.from(formList.children).forEach( (child)=> {
            formList.removeChild(child)
        })
            
        for(const service of services){
            const item = document.createElement('p')
            item.innerHTML = service.name
            
            const removeItem = document.createElement('span')
            removeItem.classList.add('remove')
            removeItem.onclick = function () {
                formList.removeChild(item)
                servicesSelected[service.id].classList.remove('service-selected')
                removeService(service.id)
            }
            
            item.appendChild(removeItem)
            formList.appendChild(item)
            document.getElementById('service-form-list-label').classList.add('display')
        }
            
        servicesPop.classList.remove('display')
        })
        
        for(const service of flyer.children){
            if(Array.from(service.classList).includes('exclude-service-list') === false) {
                service.selectorId = Object.keys(flyer.children).filter( (e) => { return flyer.children[e] === service})

                const removeButton = document.createElement('p')
                removeButton.classList.add('service-remove')

                removeButton.onclick = function () {
                    service.classList.remove('service-selected')
                    const insFormList = Array.from(formList.children).filter( (c)=> {
                        return c.getAttribute('name') === service.getAttribute('name')
                    })
                    
                const insideList = Array.from(formList.children).filter((c) => {return c.textContent === service.getAttribute('name')})
                
                if(insideList[0]){
                    formList.removeChild(insideList[0])
                }
                }

                service.insertBefore(removeButton, service.children[0])
                service.onclick = function (){
                    const selected = Object.keys(servicesSelected).map( (e) => {return servicesSelected[e].selectorId})
                    
                    if(selected.includes(service.selectorId) === false){
                        service.classList.add('service-selected')

                        servicesSelected[service.selectorId] = service
                        
                        servicesPop.classList.add('display')
                        document.getElementById('contact-service-select-text').style.display = 'none'
                        document.getElementById('selected-service-count').innerHTML = Object.keys(servicesSelected).length
                    }else{
                        delete  servicesSelected[service.selectorId] 
                        
                        document.getElementById('selected-service-count').innerHTML = Object.keys(servicesSelected).length
                        
                        if(Object.keys(servicesSelected).length === 0){
                            servicesPop.classList.remove('display')
                            document.getElementById('contact-service-select-text').style.display = 'block'
                        }
                    }
                }
            }
        }
        
        function removeService(id){
            servicesSelected[id].classList.remove('service-selected')
            delete servicesSelected[id]
            
            document.getElementById('selected-service-count').innerHTML = Object.keys(servicesSelected).length
            
            if(Object.keys(servicesSelected).length === 0){
                document.getElementById('service-form-list-label').classList.remove('display')
                document.getElementById('contact-service-select-text').style.display = 'block'
                servicesPop.classList.remove('display')
                
            }
        }
        
        document.removeService = removeService
        
    }
    
    function randomPlaceHolder () {
        const datas ={
            name: ['Hugo', 'Pedro', 'Joana', 'Maria', 'Felipe', 'Galvão', 'Lúcia', 'Bianca', 'José', 'Eduardo'][Math.floor(Math.random() * 9)],
            surname: ['Silva', 'Costa', 'Santos', 'Rodrigues', 'Rocha', 'Pereira', 'Moreira'][Math.floor(Math.random() * 6)]
        }
        
        const fields = {
            name : document.getElementById('entry.792630165'),
            surname: document.getElementById('entry.760884296'),
            email: document.getElementById('entry.1448010343')
        }
        
        for(const type in fields){
            if(datas[type]) {
                fields[type].setAttribute('placeholder', datas[type])
            }else{
                function replace (str) {
                    str = str.replace(/[àáâãäå]/g,"a");
                    str = str.replace(/[úũú]/g,"u");
                    str = str.replace(/[éẽè]/g,"e");
                    return str
                }
                fields[type].setAttribute('placeholder', (replace(datas.name) + replace(datas.surname)).toLocaleLowerCase() + '@exemplo.com')
            }
        }
        }

    return {
        publicKey,
        headerColorControl,
        smoothScroll,
        controllAppearSections,
        navColors,
        writeStyle,
        mobileMenu,
        serviceSelector,
        randomPlaceHolder
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
app.serviceSelector()

app.mobileMenu()
app.randomPlaceHolder()