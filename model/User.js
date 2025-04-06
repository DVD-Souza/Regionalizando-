class User {
    #id;
    #name;
    #email;
    #password;
    
    constructor(id, name, email, password) {
        this.#id = id;
        this.#name = name;
        this.#email = email;
        this.#password = password
    }

    
}

create(data)
findById(id)
update(id, data)
delete(id)
findByEmail(email)
