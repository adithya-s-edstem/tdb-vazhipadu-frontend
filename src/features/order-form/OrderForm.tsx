import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { NAKSHATRAS } from "../../api/types";
import { FIELD_CONTROL_CLASSES, FormField } from "./FormField";
import { MAX_NAME_LENGTH, orderDetailsSchema, type OrderDetails, type OrderDetailsInput } from "./orderDetailsSchema";

const ISO_DATE_FORMAT = "yyyy-MM-dd";

interface OrderFormProps {
  onSubmit: (details: OrderDetails) => void;
  isSubmitting: boolean;
}

export function OrderForm({ onSubmit, isSubmitting }: OrderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderDetailsInput, unknown, OrderDetails>({
    resolver: zodResolver(orderDetailsSchema),
    defaultValues: { name: "", phone: "", offeringDate: "" },
  });

  return (
    <form noValidate onSubmit={handleSubmit((details) => onSubmit(details))} className="flex flex-col gap-4">
      <FormField
        label="Name"
        errorMessage={errors.name?.message}
        renderControl={(control) => (
          <input
            {...control}
            {...register("name")}
            autoComplete="name"
            maxLength={MAX_NAME_LENGTH}
            className={FIELD_CONTROL_CLASSES}
          />
        )}
      />
      <FormField
        label="Phone"
        errorMessage={errors.phone?.message}
        renderControl={(control) => (
          <input
            {...control}
            {...register("phone")}
            type="tel"
            autoComplete="tel"
            placeholder="e.g. 98470 00001"
            className={FIELD_CONTROL_CLASSES}
          />
        )}
      />
      <FormField
        label="Nakshatra"
        errorMessage={errors.nakshatra?.message}
        renderControl={(control) => (
          <select {...control} {...register("nakshatra")} className={FIELD_CONTROL_CLASSES}>
            <option value="">Choose a nakshatra</option>
            {NAKSHATRAS.map((nakshatra) => (
              <option key={nakshatra}>{nakshatra}</option>
            ))}
          </select>
        )}
      />
      <FormField
        label="Offering date"
        errorMessage={errors.offeringDate?.message}
        renderControl={(control) => (
          <input
            {...control}
            {...register("offeringDate")}
            type="date"
            min={format(new Date(), ISO_DATE_FORMAT)}
            className={FIELD_CONTROL_CLASSES}
          />
        )}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-amber-700 px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
