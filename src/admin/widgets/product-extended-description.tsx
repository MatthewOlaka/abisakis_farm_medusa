// admin/src/widgets/product-extra-description.tsx
"use client"

import { useEffect, useState } from "react"
import { Button, Textarea, toast } from "@medusajs/ui"
import type { DetailWidgetProps } from "@medusajs/framework/types"
import { sdk } from "../lib/sdk"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Pencil } from "@medusajs/icons"

const ProductExtraDescription = ({ data }: DetailWidgetProps<any>) => {
  // last persisted value from backend
  const initial = data?.metadata?.extended_description ?? ""
  const [savedVal, setSavedVal] = useState<string>(initial)
  // current draft in the textarea
  const [val, setVal] = useState<string>(initial)
  const [isEdit, setIsEdit] = useState(false)
  const [saving, setSaving] = useState(false)

  // keep widget in sync if you navigate to a different product or it updates elsewhere
  useEffect(() => {
    const next = data?.metadata?.extended_description ?? ""
    setSavedVal(next)
    setVal(next)
    setIsEdit(false)
  }, [data?.id, data?.metadata?.extended_description])

  const handleToggleEdit = () => {
    if (isEdit) {
      // leaving edit mode WITHOUT saving → revert draft to last saved
      setVal(savedVal)
    }
    setIsEdit(!isEdit)
  }

  const onSave = async () => {
    try {
        setSaving(true)
        await sdk.admin.product.update(data.id, {
            metadata: { extended_description: val },
        })
        setSavedVal(val)
        setIsEdit(false)
        toast.success("Saved", {
            description: "Extended description updated.",
            position: "top-right"
        })

    } catch (e: any) {
        toast.error("Failed", {
            description: e?.message ?? "Please try again.",
            position: "top-right"
        })

    } finally {
        setSaving(false)
    }
  }

  return (
    <div className="bg-transparent border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Extended Description</h3>
        <button
          type="button"
          onClick={handleToggleEdit}
          aria-label={isEdit ? "Done (discard changes)" : "Edit"}
          className="inline-flex items-center gap-1 text-white hover:scale-125"
          disabled={saving}
          title={isEdit ? "Done (discard changes)" : "Edit"}
        >
          <Pencil className="transition-transform hover:scale-110" />
          <span className="text-xs">{isEdit ? "Cancel" : "Edit"}</span>
        </button>
      </div>

      <Textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={5}
        disabled={!isEdit || saving}
      />

      {isEdit && (
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      )}
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default ProductExtraDescription
