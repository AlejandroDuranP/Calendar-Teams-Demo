export interface User {
  id: string
  correo: string
  nombre: string
  tipo: string
}

export interface Client {
  id: string
  nombre: string
  // Puedes agregar más campos si los tienes en Firebase
  activo?: boolean
  fechaCreacion?: Date
}
