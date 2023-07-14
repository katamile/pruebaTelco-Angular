import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/Service/token.service';
import { UsuarioServiceService } from 'src/app/Service/usuario-service.service';
import { Usuario } from 'src/app/models/Usuario.model';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css'],
})
export class EditarUsuarioComponent {
  usuario!: Usuario; // Usuario recuperado para editar
  form!: FormGroup;
  @Input() idUsuarioAEditar!: Usuario;
  id = localStorage.getItem('idUsuario');

  constructor(
    private usuarioService: UsuarioServiceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tokenService: TokenService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    if (this.tokenService.isAdmin()) {
      this.form = this.formBuilder.group({
        username: ['', Validators.required],
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        direccion: ['', Validators.required],
        telefono: ['', Validators.required],
        foto: [''],
        status: ['', Validators.required],
      });
      // Obtener el usuario y setear los valores iniciales
      this.usuarioService.obtenerUnUsuario(+this.id!).subscribe({
        next: (data) => {
          this.usuario = data;
        },
        error: (error) => { console.log(`Ocurrió un error al traer el usuario ${error.status}`); },
        complete: () => {
          this.form.patchValue({
            username: this.usuario.username,
            firstname: this.usuario.firstname,
            lastname: this.usuario.lastname,
            direccion: this.usuario.direccion,
            telefono: this.usuario.telefono,
            foto: this.usuario.foto,
            status: this.usuario.status,
          });
        }
      });
    } else {
      this.router.navigate(['/unauthorize']);
    }
  }

  volver() {
    localStorage.removeItem('idUsuario');
    this.router.navigate(['usuario']);
  }

  guardar() {
    if (this.form.valid) {
      const usuario: Usuario = {
        id: this.usuario.id,
        username: this.form.value.username,
        firstname: this.form.value.firstname,
        lastname: this.form.value.lastname,
        direccion: this.form.value.direccion,
        telefono: this.form.value.telefono,
        foto: this.form.value.foto,
        status: this.form.value.status,
      };
      this.usuarioService.updateUsuario(usuario.id!, usuario).subscribe({
        next: (data) => {
          this.usuario = data;
          this.toastr.success('Se actualizó con éxito', 'Listo!');
          this.router.navigate(['usuario']);
        },
        error: (error) => { console.log(`Ocurrió un error al actualizar el usuario ${error.status}`); },
        complete: () => {
          localStorage.removeItem('idUsuario');
        }
      });
    } else {
      this.toastr.error('Debe completar todos los campos', 'Algo falló :(');
    }
  }
}
