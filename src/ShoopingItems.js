function ShoopingItem ({item}){
    const bgcolor = item.importance==="high"? "bg-red-200" : item.importance==="medium"? "bg-orange-200":
        "bg-green-200";
    return (<div className={`p-2 rounded mb-2 ${bgcolor}`} >
        {item.name}{item.importance==="high"? "⚠":""}
    </div>);

}
export default ShoopingItem;