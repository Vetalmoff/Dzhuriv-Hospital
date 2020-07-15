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
                            <td>${element.count}</td>
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