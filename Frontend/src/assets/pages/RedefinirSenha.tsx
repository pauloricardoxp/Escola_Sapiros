import { Card } from "../components/Card";
import { GradienteLayout } from "../layouts/GradienteLayout";
import LogoCentralizada from "../layouts/LogoCentralizada";
import FormRedefinirSenha from "../components/FormRedefinirSenha";


function RedefinirSenha() {
  return (
    <GradienteLayout>
      <Card>
        <div className="flex flex-col justify-center w-full">
          <LogoCentralizada/>
          <FormRedefinirSenha/>
        </div>
        </Card>
      </GradienteLayout>
    
  );
}

export default RedefinirSenha;
