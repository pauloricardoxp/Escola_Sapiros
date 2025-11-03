import { Card } from "../components/Card";
import FormNovaSenha from "../components/FormNovaSenha";
import { GradienteLayout } from "../layouts/GradienteLayout";
import LogoCentralizada from "../layouts/LogoCentralizada";

function NovaSenha() {
  return (
    <>
      <GradienteLayout>
        <Card>
          <div className="flex flex-col justify-center w-full">
          <LogoCentralizada/>
          <FormNovaSenha/>
        </div>
        </Card>
      </GradienteLayout>
    </>
  );
}
export default NovaSenha;
