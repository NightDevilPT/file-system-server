// history/history.saga.ts
import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateHistoryEvent } from 'src/modules/command-events/create-history.event';
import { CreateHistoryCommand } from '../command/impl/create-history.command';

@Injectable()
export class HistorySaga {
  @Saga()
  profileCreated = (events$: Observable<any>): Observable<CreateHistoryCommand> => {
    return events$.pipe(
      ofType(CreateHistoryEvent),
      map(event => {
        return new CreateHistoryCommand(event.resourceId, event.eventName,event.from,event.to);
	  }),
    );
  };
}
