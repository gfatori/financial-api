import { fail } from "assert";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Show user profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should show user profile with success", async () => {
    const user: ICreateUserDTO = {
      name: "Batata",
      email: "batata@frita.com",
      password: "000111",
    }
    const createdUser = await createUserUseCase.execute(user);

    if (createdUser.id) {
      const userProfile = await showUserProfileUseCase.execute(createdUser.id)
      expect(userProfile).toHaveProperty("id")
      expect(userProfile).toHaveProperty("name")
      expect(userProfile).toHaveProperty("email")
      expect(userProfile).toHaveProperty("password")
    } else {
      fail
    }
  })
})
