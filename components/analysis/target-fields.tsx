"use client";
import {TextField} from "@/components/ui/field";
import {useWorkspace,updateWorkspace} from "@/lib/workspace";
export function TargetFields(){
 const ws=useWorkspace();return <div className="grid gap-4 sm:grid-cols-3">{([["industry","산업"],["company","기업명"],["role","지원 직무"]] as const).map(([key,label])=><TextField key={key} id={"target-"+key} label={label} maxLength={80} value={ws.target[key]} onChange={e=>updateWorkspace({target:{...ws.target,[key]:e.target.value}})} />)}</div>;
}
