import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get statement operation', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository ,inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository ,inMemoryStatementsRepository);
  })

  it("should be able to get statement operation successfully", async () => {
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

      const retrievedStatement = await getStatementOperationUseCase.execute({
        user_id: createdStatement.user_id as string,
        statement_id: createdStatement.id as string
      })

      expect(retrievedStatement).toHaveProperty("id");
      expect(retrievedStatement).toHaveProperty("user_id");
      expect(retrievedStatement).toHaveProperty("type");
      expect(retrievedStatement).toHaveProperty("amount");
      expect(retrievedStatement).toHaveProperty("description");
      expect(retrievedStatement.amount).toBe(150)
      expect(retrievedStatement.id).toBe(createdStatement.id);
      expect(retrievedStatement.user_id).toBe(createdUser.id);

  })

  it("should not be able to get non-existing statement.", async() => {
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
        expect(async () => {
          await getStatementOperationUseCase.execute({
            user_id: createdStatement.user_id as string,
            statement_id: 'asas'
        })
      }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
  it("should not be able to get a statement from a non-existing user.", async() =>{
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
        expect(async () => {
          await getStatementOperationUseCase.execute({
            user_id: "non ecsisto" as string,
            statement_id: createdStatement.id as string
        })
      }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })
})
