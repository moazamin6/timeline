import {ValidationException, MessagesBagContract, ErrorReporterContract} from '@ioc:Adonis/Core/Validator'

type ErrorNode = {
  message: string,
  field: string,
}

export class CreateUserReporter implements ErrorReporterContract<{ errors: ErrorNode[] }> {
  public hasErrors = false

  private errors: ErrorNode[] = []
  private generalMessage: string

  constructor(private messages: MessagesBagContract, private bail: boolean) {
  }

  public report(pointer: string, rule: string, message: string, arrayExpressionPointer?: string, args?: any) {

    this.hasErrors = true
    const errorMessage = this.messages.get(pointer, rule, message, arrayExpressionPointer, args)
    this.generalMessage = errorMessage;
    this.errors.push({message: errorMessage, field: pointer})
    // this.toError()
  }

  public toError() {

    throw new ValidationException(false, this.toJSON())
  }

  public toJSON() {

    return {
      message: this.generalMessage,
      errors: this.errors,
    }
  }
}
