import _ from 'lodash'

class UserController {
  modifableValues = []

  constructor() {
    this.modifableValues = ['username', 'phone', 'email', 'fullname', 'role']
  }
}

export default UserController
