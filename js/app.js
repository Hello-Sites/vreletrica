function headerColor(){
    const header = document.getElementById('page-header')
    const banner = document.getElementById('page-banner')

    const inverseElement = Array.from(header.children)

    document.addEventListener('scroll', () => {
        if(banner.offsetHeight >  window.pageYOffset + header.offsetHeight){
            changeBackgroundColorWithFade({
                element: header,
                from: getComputedStyle(header, null).getPropertyValue("background-color"), to: "#fff" })

            for(const elem of inverseElement){
                elem.classList.remove('inverted')
            }

        }else{
            changeBackgroundColorWithFade({
                element: header,
                from: getComputedStyle(header, null).getPropertyValue("background-color"), to: "#242424" })

            for(const elem of inverseElement){
                elem.classList.add('inverted')
            }
        }
    })
}



function changeBackgroundColorWithFade({from, to, element})  {
    element.animate([ {backgroundColor: from}, {backgroundColor: to}],
    {
        duration: 200,
        fill: 'forwards'
    }
    )
}

function smoothScroll(){
    const items = document.getElementsByClassName('smooth-scroll')
    for(const item of items){
        item.addEventListener('click', scrollToObject)
    }

    function scrollToObject(event){
        event.preventDefault()
        const element = event.target.parentElement
        const href = element.getAttribute('href').slice(1)
        const target = document.getElementById(href).offsetTop

        const header = document.getElementById('page-header')
        const padding = header? header.clientHeight : 0

        window.scroll({
            top: target - padding,
            behavior: 'smooth'
        })

    }
}
smoothScroll()
headerColor()

