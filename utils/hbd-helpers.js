module.exports = {
    index(idx) {
        let i = idx + 1
        return i
    },
    roles(user, csrf) {
        console.log('user from helper ===== ', user)
        switch (user.role) {
            case 'user':
                return `
                <form method="POST" action="/users/${user.id}"> 
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="role" id="${user.id}1" value="user" checked>
                        <label class="form-check-label" for="${user.id}1">User</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="role" id="${user.id}2" value="moderator">
                        <label class="form-check-label" for="${user.id}2">Moderator</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="role" id="${user.id}3" value="admin">
                        <label class="form-check-label" for="${user.id}3">Admin</label>
                    </div>
                    <input type="hidden" name="_csrf" value="${csrf}">
                    <button type="submit" class="btn btn-info btn-sm">Підтвердити</button>
                </form>
                `
                break
            case 'moderator':
                return `
                <form method="POST" action="/users/${user.id}"> 
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="role" id="${user.id}1" value="user">
                        <label class="form-check-label" for="${user.id}1">User</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="role" id="${user.id}2" value="moderator" checked>
                        <label class="form-check-label" for="${user.id}2">Moderator</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="role" id="${user.id}3" value="admin">
                        <label class="form-check-label" for="${user.id}3">Admin</label>
                    </div>
                    <input type="hidden" name="_csrf" value="${csrf}">
                    <button type="submit" class="btn btn-info btn-sm">Підтвердити</button>
                </form>
                `
                break
            case 'admin':
                let html = `
                <form method="POST" action="/users/${user.id}"> 
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="role" id="${user.id}1" value="user" >
                        <label class="form-check-label" for="${user.id}1">User</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="role" id="${user.id}2" value="moderator">
                        <label class="form-check-label" for="${user.id}2">Moderator</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="role" id="${user.id}3" value="admin" checked>
                        <label class="form-check-label" for="${user.id}3">Admin</label>
                    </div>
                    <input type="hidden" name="_csrf" value="${csrf}">
                    <button type="submit" class="btn btn-info btn-sm">Підтвердити</button>
                </form>
                `
                return html
                break
        }

    }
}

