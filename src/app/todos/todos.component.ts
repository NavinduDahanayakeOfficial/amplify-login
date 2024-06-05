import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {generateClient, type Client} from 'aws-amplify/api';
import { ListTodosQuery, Todo } from '../../API';
import * as mutations from '../../graphql/mutations';
import * as queries from "../../graphql//queries"
import * as subscription from "../../graphql/subscriptions"



@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})

export class TodosComponent implements OnInit, OnDestroy{
  public createForm: FormGroup;
  public client:Client;

  public todos: ListTodosQuery['listTodos'];

  private subscription: any =null;

  constructor(private formBuilder: FormBuilder) {
    this.createForm = this.formBuilder.group({
      name: ['',Validators.required],
      description: ['', Validators.required],
    })

    this.client = generateClient();
   }

  async ngOnInit() {
    try {
      const response = await this.client.graphql({
        query: queries.listTodos,
      })

      this.todos = response.data.listTodos;

    } catch (error) {
      console.error('error fetching todos...', error);
    }

    this.subscription = this.client.graphql({
      query: subscription.onCreateTodo
    }).subscribe({
      next: (event:any) => {
        const newTodo = event.data.onCreateTodo;
        if(this.todos){
          this.todos.items = [newTodo, ...this.todos.items]
        }
      }
    })
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }

  public async onCreate(todo: Todo){
    try {
      const response =  await this.client.graphql({
        query: mutations.createTodo,
        variables: {input: todo}
      })
      console.log('item created!', response);
      this.createForm.reset();
    } catch (error) {
      console.error('error creating todo...', error);
    }
  }

  

}
