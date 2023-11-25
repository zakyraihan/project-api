import { TypeOrmModuleOptions } from "@nestjs/typeorm";
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,  // lihat xampp
  username: "root", // username default xampp root
  password: "", // password default xampp string kosong
  database: "be_food",
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
