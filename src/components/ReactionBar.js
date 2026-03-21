function ReactionBar({onReact}){
    const reactions=[
        {type: 'moto',emoji:'🔥',lable:'Moto'},
        {type: 'sawa',emoji:'💯',lable:'Sawa'},
        {type: 'cheka',emoji:'😂',lable:'cheka'},
        {type: 'kumbe',emoji:'😯',lable:'kumbe'},
        {type: 'pole',emoji:'🙏',lable:'Pole'},
        {type: 'nguvu',emoji:'💪',lable:'Nguvu'},
    ];
    return(
        <div className="reaction-bar">
            {reactions.map((reaction)=>(
                <button
                key={reaction.type}
                className="reaction-btn"
                onClick={()=>onReact(reaction.type)}
                title={reaction.lable}
                >
                    {reaction.emoji}
                </button>
            ))}
        </div>
    )
}
export default ReactionBar;