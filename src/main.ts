import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("JS Code Api")
    .setDescription("JS Code Video Tutorial endpoints")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup("api", app, document);

  await app.listen(port);

  Logger.log(`🚀 Server running on http://localhost:${port}`, "Bootstrap");
}
bootstrap();
