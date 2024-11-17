export class ApiResponse<D> {
 status: number;
 data: D;

 constructor(status: number, data: D) {
   this.status = status;
   this.data = data;
 }
}
