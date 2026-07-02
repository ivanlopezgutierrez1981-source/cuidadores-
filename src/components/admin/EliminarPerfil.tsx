"use client";

import { eliminarPerfil } from "@/app/admin/cuidadores/actions";

export default function EliminarPerfil({
  profileId,
  nombre,
}: {
  profileId: string;
  nombre: string;
}) {
  return (
    <form
      action={eliminarPerfil}
      onSubmit={(e) => {
        if (
          !confirm(
            `¿Eliminar el perfil de "${nombre}"? Esta acción es irreversible y borrará también sus mensajes y pagos.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="profileId" value={profileId} />
      <button
        type="submit"
        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
      >
        Eliminar
      </button>
    </form>
  );
}
