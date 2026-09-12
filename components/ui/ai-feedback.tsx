"use client";
import type {AiStatus} from "@/lib/use-ai";
import {startSample} from "@/lib/workspace";
import {ErrorCard,LoadingCard,UnavailableCard} from "./states";
export const showResult=(status:AiStatus)=>status==="idle"||status==="success";
export function AiFeedback({status,onAgain}:{status:AiStatus;onAgain:()=>void}){
 if(status==="loading")return <LoadingCard message="입력한 경험을 분석하고 있습니다. 잠시 기다려 주세요."/>;
 if(status==="error")return <ErrorCard onAgain={onAgain}/>;
 if(status==="unavailable")return <UnavailableCard onSample={startSample}/>;
 if(status==="limited")return <p role="alert" className="rounded-card bg-soft-orange p-5">요청이 많습니다. 잠시 후 다시 시도해주세요.</p>;
 return null;
}
