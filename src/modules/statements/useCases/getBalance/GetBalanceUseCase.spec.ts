import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

  let createUserUseCase: CreateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;
  let getBalanceUseCase: GetBalanceUseCase;

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository ,inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  })

  it("should be able to get balance from a user successfully", async () => {
  const user: ICreateUserDTO = {
      name: "Batata",
      email: "batata@frita.com",
      password: "000111",
    }

    const createdUser = await createUserUseCase.execute(user);

      const statement_1 = await createStatementUseCase.execute({
        user_id: createdUser.id as string,
        type: OperationType.DEPOSIT,
        amount: 150.0 as number,
        description: "deposited" as string
      })

      const statement_2 = await createStatementUseCase.execute({
        user_id: createdUser.id as string,
        type: OperationType.WITHDRAW,
        amount: 50.0 as number,
        description: "withdrew" as string
      })

      const receivedBalance = await getBalanceUseCase.execute({
        user_id: createdUser.id as string
      })

      expect(receivedBalance.statement).toHaveLength(2)
      expect(receivedBalance.balance).toBe(100)
      expect(receivedBalance.statement[0]).toEqual(statement_1)
      expect(receivedBalance.statement[1]).toEqual(statement_2)
  })

  it("should not be able to get balance from a non existing user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "1" as string
      })
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
})
