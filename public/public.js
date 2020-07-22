const $searchBtn = document.querySelector('#searchButton')
const $searchInput = document.querySelector('#searchInput')
const $container = document.querySelector('#container')

$searchBtn.addEventListener('click', (event) => {
    event.preventDefault()
    console.log($searchInput.value)

    fetch(`/medicine?title=${$searchInput.value}`)
        .then( res => res.json())
            //.then(data => console.log('item = ', data))
            .then(data => {
                if (data.length === 0) {
                    $container.innerHTML = `<h1>Нічого не знайдено</h1>`
                } else {
                    console.log(data)
                    let html = `
                    <h1>Знайдено :</h1>
                    <table class="table">
                        <thead class="thead-dark">
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Назва</th>
                            <th scope="col">Залишок</th>
                            <th scope="col">Опис</th>
                            </tr>
                        </thead>`
    
                    data.forEach(element => {
                        html += `
                        <tbody>
                            <tr>
                            <th scope="row">${element.id}</th>
                            <td>${element.title}</td>
                            <td>${element.remainder}</td>
                            <td>${element.description}</td>
                            </tr>
                        </tbody>`
                    })
                    html += `</table>`
                    $container.innerHTML = html
                }
            })            
        .catch(e => {
            console.log(e)
        })
})



$(document).ready(() => {
    let url = location.href.replace(/\/$/, "");
   
    if (location.hash) {
      const hash = url.split("#");
      $('#myTab a[href="#'+hash[1]+'"]').tab("show");
      url = location.href.replace(/\/#/, "#");
      history.replaceState(null, null, url);
      setTimeout(() => {
        $(window).scrollTop(0);
      }, 400);
    } 
     
    $('a[data-toggle="tab"]').on("click", function() {
      let newUrl;
      const hash = $(this).attr("href");
      
        newUrl = url.split("#")[0] + hash;
      
      
      history.replaceState(null, null, newUrl);
    });
  });




const $confirm = document.querySelector('#passwordConfirm')
const $password = document.querySelector('#password')
const $confirmHelpRegister = document.querySelector('#confirmHelpRegister')
const $submitButton = document.querySelector('#submitButton')

if ( ($confirm)) {
    $confirm.addEventListener('input', (event) => {
        if ($confirm.value !== $password.value) {
            $confirmHelpRegister.innerHTML = 'Паролі не співпадають!'
            $confirmHelpRegister.classList.add('active')
            $confirmHelpRegister.classList.remove('text-muted')
            $submitButton.disabled=true
        } else {
            $confirmHelpRegister.innerHTML = ''
            $confirmHelpRegister.classList.remove('active')
            $confirmHelpRegister.classList.add('text-muted')
            $submitButton.disabled=false
        }
    })
}
  


