import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IGetStatementOperationDTO } from "../getStatementOperation/IGetStatementOperationDTO";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

  let createUserUseCase: CreateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;
  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe('Create statement', () => {

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository ,inMemoryStatementsRepository);
  })

  it("should create a deposit statement successfully", async () => {
    const user: ICreateUserDTO = {
      name: "Batata",
      email: "batata@frita.com",
      password: "000111",
    }
    const createdUser = await createUserUseCase.execute(user);

      const createdStatement = await createStatementUseCase.execute({
        user_id: createdUser.id as string,
        type: OperationType.DEPOSIT,
        amount: 150.0 as number,
        description: "batata" as string
      })
      expect(createdStatement).toHaveProperty("id")
      expect(createdStatement).toHaveProperty("user_id")
      expect(createdStatement).toHaveProperty("type")
      expect(createdStatement).toHaveProperty("amount")
      expect(createdStatement).toHaveProperty("description")
      expect(createdStatement.amount).toBe(150)
      expect(createdStatement.type).toBe('deposit')
  })

  it("should create a withdraw statement successfully", async () => {
    const user: ICreateUserDTO = {
      name: "Batata",
      email: "batata@frita.com",
      password: "000111",
    }
    const createdUser = await createUserUseCase.execute(user);

      await createStatementUseCase.execute({
        user_id: createdUser.id as string,
        type: OperationType.DEPOSIT,
        amount: 150.0 as number,
        description: "batata" as string
      })

      const createdWithdrawStatement = await createStatementUseCase.execute({
        user_id: createdUser.id as string,
        type: OperationType.WITHDRAW,
        amount: 150.0 as number,
        description: "batata" as string
      })
      expect(createdWithdrawStatement).toHaveProperty("id")
      expect(createdWithdrawStatement).toHaveProperty("user_id")
      expect(createdWithdrawStatement).toHaveProperty("type")
      expect(createdWithdrawStatement).toHaveProperty("amount")
      expect(createdWithdrawStatement).toHaveProperty("description")
      expect(createdWithdrawStatement.amount).toBe(150)
      expect(createdWithdrawStatement.type).toBe('withdraw')
  })

  it("should not be able create a statement for non existing user", async () => {
    expect(async () => {
      const createdStatement = await createStatementUseCase.execute({
        user_id: '123123123' as string,
        type: OperationType.DEPOSIT,
        amount: 150.0 as number,
        description: "no deposit here" as string
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })
  it("should not be able to create a withdraw having insuficient funds", async () => {
    const user: ICreateUserDTO = {
      name: "Batata",
      email: "batata@frita.com",
      password: "000111",
    }
    const createdUser = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 1.0 as number,
      description: "batata" as string
    })

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: createdUser.id as string,
        type: OperationType.WITHDRAW,
        amount: 2.0 as number,
        description: "Can`t withdraw" as string
    })
      }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
