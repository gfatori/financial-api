import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;


describe("Create user User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })


  it("should be able to create a user successfully", async () => {
    const user: ICreateUserDTO = {
      name: "Batata",
      email: "batata@frita.com",
      password: "000111",
    }
    const createdUser = await createUserUseCase.execute(user);
    expect(createdUser).toHaveProperty("name")
    expect(createdUser).toHaveProperty("email")
    expect(createdUser).toHaveProperty("password")
    expect(createdUser).toHaveProperty("id")
  })

  it("should be not able to create an existing user", async () => {
    const user: ICreateUserDTO = {
      name: "Óleo",
      email: "batata@frita.com",
      password: "000111",
    }
    const createdUser = await createUserUseCase.execute(user);
    expect(async () => {
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError)
  })

})
