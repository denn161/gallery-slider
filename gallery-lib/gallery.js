


class Gallery{

    constructor(selector,options={}){
        this.$el=document.querySelector(selector)
        this.size =this.$el.childElementCount
        this.currentSlide =0
        this.currentChangeSlide=false
        this.GalleryClassName = 'gallery'
        this.GalleryLineClassName = 'gallery-line'
        this.GallerySlideClassName = 'gallery-slide'
        this.GalleryDraggableClassName = 'gallery-draggable'
        this.GalleryNavigationClassName ='gallery-navigation'
        this.GalleryDotsClassName = 'gallery-pagination'
        this.GalleryDotClassName = 'gallery-dot'
        this.GalleryBtnPrev='gallery-btn-prev'
        this.GalleryBtnNext = 'gallery-btn-next'
        this.GalleryActiveDots='gallery-pagination-active'
        this.BtnOrangeClassName = 'btn-orange'
        this.BtnDarkOrangeClassName ='btn-dark-orange'

        this.renderHTML=this.renderHTML.bind(this)
        this.setParameters=this.setParameters.bind(this)
        this.setEvents=this.setEvents.bind(this)
        this.startDrag=this.startDrag.bind(this)
        this.stopDrag =this.stopDrag.bind(this)
        this.moveDarag = this.moveDarag.bind(this)
        this.stylePosition=this.stylePosition.bind(this)
        this.setStyleTransition=this.setStyleTransition.bind(this)
        this.resetStyleTransition=this.resetStyleTransition.bind(this)
        this.clickDot=this.clickDot.bind(this)
        this.moveNext=this.moveNext.bind(this)
        this.movePrev = this.movePrev.bind(this)
        this.settings={
            margin:options.margin||0,
            btnTheme:options.btnTheme||''
        }
       
        
        this.renderHTML()
        this.setParameters()
        this.setEvents()      

    }

    renderHTML(){
        this.$el.classList.add(this.GalleryClassName)
        this.$el.innerHTML = `<div class=${this.GalleryLineClassName}>
           ${this.$el.innerHTML}             
        </div>
        <div class=${this.GalleryNavigationClassName}>
        <button class=${this.GalleryBtnNext}></button>
        <button class=${this.GalleryBtnPrev}></button>
       </div>  
       <div class=${this.GalleryDotsClassName}>
         
       </div>         `
       
         this.dotsBlock = document.querySelector(`.${this.GalleryDotsClassName}`)
         this.navBlock = document.querySelector(`.${this.GalleryNavigationClassName}`)
         this.navBtns = this.navBlock.querySelectorAll('button')

         this.navBtns.forEach((btn)=>{
             if(this.settings.btnTheme==='orange'){
                 btn.classList.add(this.BtnOrangeClassName)

             }
             if(this.settings.btnTheme==='darkOrange'){
                 btn.classList.add(this.BtnDarkOrangeClassName)
             }             
         })



        //  let span =''
        //  for(let i=0;i<this.size;i++){
        //      span+=`
        // <span class="${this.GalleryDotClassName}"></span>`        
          
        //  }
        //  this.dotsBlock.innerHTML=span          
          
          

     this.dotsBlock.innerHTML=Array.from(Array(this.size).keys()).map((key)=>{
       return `<span class="${this.GalleryDotClassName} ${key===this.currentSlide?this.GalleryActiveDots:''}"></span>`
            }).join('')


            this.dotsNode = this.dotsBlock.querySelectorAll('.gallery-dot')
            this.btnPrev = this.$el.querySelector('.gallery-btn-prev')
            this.btnNext = this.$el.querySelector('.gallery-btn-next')
            
           
              
         
           

        


        this.lineNode = document.querySelector(`.${this.GalleryLineClassName}`)
        this.lineNodes = Array.from(this.lineNode.children).map((node)=>{
                     const div = document.createElement('div')
                           div.classList.add(this.GallerySlideClassName)
                           node.parentNode.insertBefore(div,node) 
                           div.append(node)    
                           return div               
                     
        })
    }

    setParameters(){
        const widthGallery =  this.$el.getBoundingClientRect()
        this.width = widthGallery.width
        this.maximumX=-(this.size-1)*(this.width+this.settings.margin)
        this.x =-this.currentSlide*(this.width+this.settings.margin)   
        this.resetStyleTransition()  
        this.lineNode.style.width=`${this.size*(this.width+this.settings.margin)}px`  
        this.stylePosition()
        Array.from(this.lineNode.children).forEach(item=>{
            item.style.width=`${this.width}px`
            item.style.marginRight=`${this.settings.margin}px`
        })
              

    }

    setEvents(){
        this.debounceResized = debounce(this.setParameters)
        window.addEventListener('resize',this.debounceResized)
        this.lineNode.addEventListener('pointerdown',this.startDrag)
        window.addEventListener('pointerup',this.stopDrag)
        window.addEventListener('pointercancel',this.stopDrag)
        this.dotsBlock.addEventListener('click',this.clickDot)
        this.btnNext.addEventListener('click',this.moveNext)
        this.btnPrev.addEventListener('click',this.movePrev)
        

    }    
    destroyEvents(){
        window.removeEventListener('resize',this.debounceResized)
        this.lineNode.removeEventListener('pointerdown',this.startDrag)
        window.removeEventListener('pointerup',this.stopDrag)
        window.removeEventListener('pointercancel',this.stopDrag)
        this.dotsBlock.removeEventListener('click',this.clickDot)
        this.btnNext.removeEventListener('click',this.moveNext)
        this.btnPrev.removeEventListener('click',this.movePrev)
        
    }

    startDrag(e){
        this.currentChangeSlide=false
        this.clickX =e.pageX
        this.startX = this.x        
        this.resetStyleTransition()
        this.$el.classList.add(this.GalleryDraggableClassName)
        window.addEventListener('pointermove',this.moveDarag)
     

    }

    stopDrag(){
        window.removeEventListener('pointermove',this.moveDarag)
        this.$el.classList.remove(this.GalleryDraggableClassName)
        this.x =-this.currentSlide*(this.width+this.settings.margin)
        this.stylePosition()
        this.setStyleTransition()      

    }

    moveDarag(e){
        this.dragX=e.pageX
        const dragShift=this.dragX-this.clickX
        const easing = dragShift/5;
        this.x=Math.max(Math.min(this.startX+dragShift,easing),this.maximumX+easing)
        this.stylePosition()
        this.chachgeCurrentSlide()

        if(dragShift>20&&dragShift>0&&!this.currentChangeSlide&&this.currentSlide>0){
             this.currentChangeSlide=true
             this.currentSlide=this.currentSlide-1
        }

        if(dragShift<-20&&dragShift<0&&!this.currentChangeSlide&&this.currentSlide<this.size-1){
            this.currentChangeSlide=true
            this.currentSlide=this.currentSlide+1
       }      


    }
    stylePosition(){
        this.lineNode.style.transform =`translate3d(${this.x}px,0,0)`
    }

    setStyleTransition(countSwipes=1){
        this.lineNode.style.transition=`all ${0.4*countSwipes}s ease`


    }

    resetStyleTransition(){
        this.lineNode.style.transition='none'
    }

    //navigation and pagination

    clickDot(e){   
        const doteNode = e.target.closest('span')
           if(!doteNode){
               return
           }
        
           let dotNumber;

          this.dotsNode.forEach((dot,i)=>{
           if(this.dotsNode[i]===doteNode){
                  dotNumber=i
               
              }          
          })

         

           this.countSwipes = Math.abs(this.currentSlide-dotNumber)     

           this.currentSlide=dotNumber         
           this.chachgeCurrentSlide(this.countSwipes) 
          
      

    }

    moveNext(){       
        
        if(this.currentSlide>=this.size-1){
            this.currentSlide=-1
                       
        }
         this.currentSlide+=1
         this.chachgeCurrentSlide()
         


    }

    movePrev(){
        if(this.currentSlide<=0){
          this.currentSlide=this.size
        }

        this.currentSlide-=1
        this.chachgeCurrentSlide()
        

    }

    chachgeCurrentSlide(countSwipes){
        this.x =-this.currentSlide*(this.width+this.settings.margin)
        this.stylePosition()
        this.setStyleTransition(countSwipes)
        this.dotsNode.forEach(item=>item.classList.remove(this.GalleryActiveDots))
        this.dotsNode[this.currentSlide].classList.add(this.GalleryActiveDots)

    }



   

  
}


function debounce(func,time=100){
   let timer;
   return function(event){
       clearTimeout(timer)
      timer=setTimeout(func,time,event)
   }


}

console.log(Array.from(Array(4).keys()))


