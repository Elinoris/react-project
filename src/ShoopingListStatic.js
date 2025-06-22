import ShoopingItem from "./ShoopingItems";
function ShoopingListStatic({items}){
    if(!items.length){return <p>No items found.</p>;}
    return (<div> {items.map((item)=><ShoopingItem key={item.id} item={item} />)}</div>);

}
export default ShoopingListStatic;