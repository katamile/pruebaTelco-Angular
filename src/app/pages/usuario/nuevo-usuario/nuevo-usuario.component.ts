import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsuarioServiceService } from 'src/app/Service/usuario-service.service';
import { Roles } from 'src/app/models/Roles.model';
import { Usuario } from 'src/app/models/Usuario.model';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css'],
})
export class NuevoUsuarioComponent implements OnInit {
  @Output() usuarioGuardado = new EventEmitter<Usuario>();

  form!: FormGroup;
  roles: Roles[] = [];

  constructor(
    private usuarioService: UsuarioServiceService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      foto: [''],
      status: ['', Validators.required],
    });

    this.usuarioService.traerRoles().subscribe({
      next: (data: Roles[]) => {
        this.roles = data;
      },
      error: (error) => {
        console.log('Ocurrió un error al traer los roles');
      },
      complete: () => {}
    });
  }

  guardar() {
    if (this.form.valid) {
      const usuario: Usuario = {
        username: this.form.value.username,
        firstname: this.form.value.firstname,
        lastname: this.form.value.lastname,
        direccion: this.form.value.direccion,
        telefono: this.form.value.telefono,
        foto: this.form.value.foto,
        status: this.form.value.status,
      };

      this.usuarioService.crearNuevoUsuario(usuario).subscribe({
        next: (data) => {
          this.usuarioGuardado.emit(data);
          this.toastr.success('Usuario creado satisfactoriamente', 'Éxito');
        },
        error: (error) => {
          this.toastr.error('Ocurrió un error al crear el usuario', 'Error');
        },
        complete: () => {
          this.form.reset();
        }
      });
    } else {
      this.toastr.error('Debe completar todos los campos', 'Campos incompletos');
    }
  }
}
