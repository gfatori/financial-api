import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { UsersRepository } from "../../repositories/UsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should authenticate a user with success", async () => {
    const user: ICreateUserDTO = {
      name: "PotatoHead",
      email: "french@fries.com",
      password: "111000",
    };
    await createUserUseCase.execute(user);

    const authentication = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })
    expect(authentication).toHaveProperty("token")
    expect(authentication).toHaveProperty("user")
  })

  it("should not authenticate a user with wrong password", async () => {
    const user: ICreateUserDTO = {
      name: "PotatoHead",
      email: "french@fries.com",
      password: "111000",
    };
    await createUserUseCase.execute(user);

    expect(async () => {
      const authentication = await authenticateUserUseCase.execute({
        email: user.email,
        password: "12781278127845"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  })

  it("should not authenticate a non existing user", async () => {
    const user: ICreateUserDTO = {
      name: "PotatoHead",
      email: "french@fries.com",
      password: "111000",
    };
    await createUserUseCase.execute(user);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "non@ecsisto.com",
        password: user.password
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)


  })
 })
